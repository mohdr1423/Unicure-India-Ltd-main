import fs from "node:fs";
import path from "node:path";
import { createFileRoute } from "@tanstack/react-router";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience?: string;
  qualifications?: string;
  description: string;
  is_open: boolean;
  created_at?: string;
}

export function getLocalJobOpenings(): JobOpening[] {
  const dataDir = path.resolve(process.cwd(), "data");
  const filePath = path.resolve(dataDir, "job-openings.json");
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {
    console.error("[Careers API] Error reading job-openings.json:", err);
  }
  return [];
}

export function saveLocalJobOpenings(jobs: JobOpening[]): void {
  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const filePath = path.resolve(dataDir, "job-openings.json");
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), "utf-8");
}

export const Route = createFileRoute("/api/careers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const showAll = url.searchParams.get("all") === "true";
          let jobs = getLocalJobOpenings();
          if (!showAll) {
            jobs = jobs.filter((j) => j.is_open);
          }
          return new Response(
            JSON.stringify({ success: true, count: jobs.length, jobs }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err.message, jobs: [] }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
