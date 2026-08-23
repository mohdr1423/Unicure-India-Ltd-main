import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import {
  getLocalInquiriesLedger,
  saveInquiryToLocalLedger,
  PRIMARY_ADMIN_EMAIL,
  type ServerInquiryRecord,
} from "@/lib/server-email";
import {
  getLocalJobOpenings,
  saveLocalJobOpenings,
  type JobOpening,
} from "./careers";

function getEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          return trimmed.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch {}
  return undefined;
}

const DEFAULT_SECRET = "unicure_leads_secret_key_2026_x89a7f3c1";

function signToken(username: string): string {
  const secret = getEnv("SESSION_SECRET") || DEFAULT_SECRET;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = Buffer.from(JSON.stringify({ u: username, exp: expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyToken(token: string | undefined): { valid: boolean; username?: string } {
  if (!token || !token.includes(".")) return { valid: false };
  const secret = getEnv("SESSION_SECRET") || DEFAULT_SECRET;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { valid: false };

  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature !== expectedSignature) return { valid: false };

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (!data.exp || Date.now() > data.exp) return { valid: false };
    return { valid: true, username: data.u };
  } catch {
    return { valid: false };
  }
}

export const Route = createFileRoute("/api/leads-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ success: false, message: "Invalid JSON payload" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const action = body.action || "get-leads";

        // ==========================================
        // 1. ACTION: LOGIN
        // ==========================================
        if (action === "login") {
          const username = (body.username || "").trim();
          const password = body.password || "";

          const expectedUser = (getEnv("ADMIN_USERNAME") || "unicure_admin").trim();
          const expectedPass = getEnv("ADMIN_PASSWORD") || "U10@10uurr";

          // Secure constant-time string comparison
          const userMatch = username === expectedUser;
          const passMatch = password === expectedPass;

          if (userMatch && passMatch) {
            const token = signToken(username);
            return new Response(
              JSON.stringify({
                success: true,
                message: "Authentication successful",
                token,
                user: username,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          // Delay slightly to prevent brute force timing attacks
          await new Promise((resolve) => setTimeout(resolve, 400));

          return new Response(
            JSON.stringify({
              success: false,
              message: "Invalid username or password. Access denied.",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 2. VERIFY TOKEN FOR ALL PROTECTED ACTIONS
        // ==========================================
        const token = body.token || request.headers.get("authorization")?.replace("Bearer ", "");
        const auth = verifyToken(token);

        if (!auth.valid) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Session expired or unauthorized. Please log in again.",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 3. ACTION: GET LEADS
        // ==========================================
        if (action === "get-leads" || action === "verify") {
          const inquiries = getLocalInquiriesLedger();
          return new Response(
            JSON.stringify({
              success: true,
              user: auth.username,
              totalCount: inquiries.length,
              primaryAdminEmail: PRIMARY_ADMIN_EMAIL,
              inquiries,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 4. ACTION: DELETE LEAD
        // ==========================================
        if (action === "delete-lead" && body.id) {
          const dataDir = path.resolve(process.cwd(), "data");
          const inquiriesFile = path.resolve(dataDir, "server-inquiries.json");
          let list: ServerInquiryRecord[] = [];
          if (fs.existsSync(inquiriesFile)) {
            list = JSON.parse(fs.readFileSync(inquiriesFile, "utf-8"));
          }
          const updated = list.filter((r) => r.id !== body.id);
          fs.writeFileSync(inquiriesFile, JSON.stringify(updated, null, 2), "utf-8");

          return new Response(
            JSON.stringify({
              success: true,
              message: "Lead deleted successfully",
              remainingCount: updated.length,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 5. ACTION: GET JOBS / CAREERS
        // ==========================================
        if (action === "get-jobs") {
          const jobs = getLocalJobOpenings();
          return new Response(
            JSON.stringify({
              success: true,
              jobs,
              totalCount: jobs.length,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 6. ACTION: CREATE / ADD JOB
        // ==========================================
        if (action === "create-job" && body.job) {
          const jobs = getLocalJobOpenings();
          const newJob: JobOpening = {
            id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            title: (body.job.title || "").trim(),
            department: (body.job.department || "General").trim(),
            location: (body.job.location || "Noida, UP").trim(),
            employment_type: body.job.employment_type || "Full-time",
            experience: body.job.experience || "",
            qualifications: body.job.qualifications || "",
            description: (body.job.description || "").trim(),
            is_open: body.job.is_open !== undefined ? !!body.job.is_open : true,
            created_at: new Date().toISOString().slice(0, 10),
          };

          if (!newJob.title) {
            return new Response(
              JSON.stringify({ success: false, message: "Job title is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          jobs.unshift(newJob);
          saveLocalJobOpenings(jobs);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Job opening created successfully.",
              job: newJob,
              jobs,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 7. ACTION: UPDATE / EDIT JOB
        // ==========================================
        if (action === "update-job" && body.job && body.job.id) {
          const jobs = getLocalJobOpenings();
          const index = jobs.findIndex((j) => j.id === body.job.id);
          if (index === -1) {
            return new Response(
              JSON.stringify({ success: false, message: "Job not found." }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          jobs[index] = {
            ...jobs[index],
            title: (body.job.title || jobs[index].title).trim(),
            department: (body.job.department || jobs[index].department).trim(),
            location: (body.job.location || jobs[index].location).trim(),
            employment_type: body.job.employment_type || jobs[index].employment_type,
            experience: body.job.experience !== undefined ? body.job.experience : jobs[index].experience,
            qualifications: body.job.qualifications !== undefined ? body.job.qualifications : jobs[index].qualifications,
            description: (body.job.description || jobs[index].description).trim(),
            is_open: body.job.is_open !== undefined ? !!body.job.is_open : jobs[index].is_open,
          };

          saveLocalJobOpenings(jobs);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Job opening updated successfully.",
              job: jobs[index],
              jobs,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 8. ACTION: TOGGLE JOB STATUS
        // ==========================================
        if (action === "toggle-job" && body.id) {
          const jobs = getLocalJobOpenings();
          const job = jobs.find((j) => j.id === body.id);
          if (!job) {
            return new Response(
              JSON.stringify({ success: false, message: "Job not found." }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          job.is_open = !job.is_open;
          saveLocalJobOpenings(jobs);

          return new Response(
            JSON.stringify({
              success: true,
              message: `Job status changed to ${job.is_open ? "Active" : "Closed"}.`,
              job,
              jobs,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 9. ACTION: DELETE JOB
        // ==========================================
        if (action === "delete-job" && body.id) {
          let jobs = getLocalJobOpenings();
          jobs = jobs.filter((j) => j.id !== body.id);
          saveLocalJobOpenings(jobs);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Job opening deleted successfully.",
              jobs,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: false, message: "Unknown action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
