import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import {
  getLocalInquiriesLedger,
  saveInquiryToLocalLedger,
  dispatchInquiryEmail,
  PRIMARY_ADMIN_EMAIL,
  type ServerInquiryRecord,
} from "@/lib/server-email";

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
        // 4. ACTION: RETRY EMAIL DISPATCH
        // ==========================================
        if (action === "retry-email" && body.id) {
          const inquiries = getLocalInquiriesLedger();
          const record = inquiries.find((r) => r.id === body.id);
          if (!record) {
            return new Response(
              JSON.stringify({ success: false, message: "Inquiry not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          const result = await dispatchInquiryEmail(record);
          record.email_status = result.success ? "sent" : "failed";
          record.email_provider = result.provider;
          if (result.error) record.error_log = result.error;
          saveInquiryToLocalLedger(record);

          return new Response(
            JSON.stringify({
              success: result.success,
              message: result.success
                ? `Email delivered via ${result.provider}`
                : `Delivery error: ${result.error}`,
              record,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        // ==========================================
        // 5. ACTION: DELETE LEAD
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

        return new Response(
          JSON.stringify({ success: false, message: "Unknown action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
