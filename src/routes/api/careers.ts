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
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  apply_email?: string;
  salary_range?: string;
  is_open: boolean;
  created_at?: string;
}

const DEFAULT_SAMPLE_JOBS: JobOpening[] = [
  {
    id: "job_qc_analyst",
    title: "Quality Control Analyst",
    department: "Quality Assurance",
    location: "Greater Noida, UP",
    employment_type: "Full-time",
    experience: "2-5 Years",
    qualifications: "B.Sc / M.Sc Chemistry or B.Pharma",
    description: "Responsible for sampling, testing, and analytical validation of raw materials, in-process formulations, and finished dosage forms according to WHO-GMP and pharmacopoeial specifications.",
    responsibilities: [
      "Perform HPLC, GC, UV-Vis spectrophotometry, and wet chemical analysis on raw materials and finished goods.",
      "Conduct in-process quality testing during tablet compression, capsule filling, and liquid oral manufacturing.",
      "Maintain strict documentation in compliance with Good Laboratory Practices (GLP) and Data Integrity standards.",
      "Perform stability testing, sample logging, and shelf-life degradation studies.",
      "Assist in Out of Specification (OOS) and Out of Trend (OOT) investigations.",
    ],
    requirements: [
      "Degree in Chemistry, Analytical Chemistry, or Pharmaceutical Sciences.",
      "Minimum 2+ years of hands-on experience in a cGMP / WHO-GMP pharmaceutical testing laboratory.",
      "Proficiency with chromatography data systems (Empower/ChemStation) and standard wet lab equipment.",
      "Familiarity with IP, BP, and USP compendial testing procedures.",
    ],
    skills: ["HPLC", "GC", "UV-Vis", "GLP", "SOP Compliance", "Method Validation"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
  {
    id: "job_prod_supervisor",
    title: "Production Supervisor (Solid Orals)",
    department: "Manufacturing",
    location: "Roorkee, Uttarakhand",
    employment_type: "Full-time",
    experience: "3-6 Years",
    qualifications: "B.Pharma / Diploma in Pharma Tech",
    description: "Supervising granulation, compression, and coating lines for tablets and capsules. Ensuring strict batch record documentation and adherence to cGMP safety protocols.",
    responsibilities: [
      "Oversee day-to-day operations in granulation, tablet compression, capsule filling, and coating sections.",
      "Ensure proper execution of Batch Manufacturing Records (BMR) and Batch Packaging Records (BPR).",
      "Monitor machine parameters, line clearance procedures, and cleanroom environmental controls.",
      "Train shop-floor operators on cGMP guidelines, standard operating procedures, and safety norms.",
      "Coordinate with engineering and QA teams for preventive maintenance and qualification activities.",
    ],
    requirements: [
      "B.Pharma or Diploma in Pharmaceutical Technology.",
      "3-6 years of experience in solid oral dosage form manufacturing under cGMP / WHO-GMP compliance.",
      "Demonstrated team leadership and shop-floor management skills.",
    ],
    skills: ["Granulation", "Compression", "Auto-Coater", "BMR Documentation", "cGMP", "Yield Optimization"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
  {
    id: "job_formulation_scientist",
    title: "Formulation Scientist (R&D)",
    department: "R&D",
    location: "Noida, UP",
    employment_type: "Full-time",
    experience: "4-8 Years",
    qualifications: "M.Pharma (Pharmaceutics) / Ph.D.",
    description: "Formulation development and optimization for novel and generic oral dosage forms, technology transfer to commercial plants, and stability study analysis.",
    responsibilities: [
      "Design and execute pre-formulation, formulation development, and process optimization studies for oral solids and liquids.",
      "Conduct pilot-scale trial batches and execute successful technology transfer to commercial manufacturing facilities.",
      "Prepare Product Development Reports (PDR), Master Formula Cards (MFC), and stability protocols.",
      "Collaborate with regulatory affairs to address technical queries and dossier development requirements.",
    ],
    requirements: [
      "Master's in Pharmacy (Pharmaceutics) or Ph.D. in Pharmaceutical Sciences.",
      "4-8 years of proven experience in formulation R&D for oral solid and liquid dosage forms.",
      "Strong understanding of Quality by Design (QbD) principles and scale-up strategies.",
    ],
    skills: ["Formulation R&D", "QbD", "Tech Transfer", "Scale-up", "Stability Studies", "PDR Preparation"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
  {
    id: "job_regulatory_exec",
    title: "Regulatory Affairs Executive",
    department: "Regulatory",
    location: "Noida, UP",
    employment_type: "Full-time",
    experience: "2-4 Years",
    qualifications: "B.Pharma / M.Pharma",
    description: "Preparation and submission of dossiers (CTD/ACTD format) for domestic and international health authorities across Latin America, Africa, and CIS markets.",
    responsibilities: [
      "Compile and review Common Technical Document (CTD / ACTD) dossiers for international product registrations.",
      "Prepare responses to deficiency letters and regulatory queries from foreign health ministries.",
      "Maintain registration status databases, product lifecycle renewals, and variation filings.",
      "Coordinate with QA, R&D, and production teams to gather analytical data and validation documents.",
    ],
    requirements: [
      "B.Pharma or M.Pharma with 2-4 years of experience in export regulatory affairs.",
      "Thorough understanding of CTD/ACTD dossier formats, ASEAN guidelines, and WHO-PQ standards.",
      "Excellent written communication and technical documentation skills.",
    ],
    skills: ["CTD / ACTD", "Export Registration", "Dossier Compilation", "Query Resolution", "Regulatory Compliance"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
  {
    id: "job_packaging_operator",
    title: "Packaging Line Operator",
    department: "Manufacturing",
    location: "Greater Noida, UP",
    employment_type: "Full-time",
    experience: "1-3 Years",
    qualifications: "ITI / Diploma / High School",
    description: "Operation and maintenance of blister packaging machines, cartoners, and labeling lines in high-speed pharmaceutical packaging environments.",
    responsibilities: [
      "Operate Alu-Alu and Blister packaging machinery, strip packing units, and automatic cartoners.",
      "Perform machine changeovers, tooling adjustments, and primary leak testing for blisters.",
      "Verify batch coding, MRP, expiry date printing, and optical sensor functioning on packaging lines.",
      "Adhere strictly to line clearance protocols and cGMP packaging documentation.",
    ],
    requirements: [
      "ITI Certificate or Diploma in Mechanical/Electrical or High School with relevant experience.",
      "1-3 years of operating pharmaceutical packaging machinery.",
      "Attention to detail and physical stamina for manufacturing shifts.",
    ],
    skills: ["Blister Packing", "Alu-Alu", "Batch Coding", "Line Clearance", "Cartoning"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
  {
    id: "job_medical_sales_rep",
    title: "Institutional Sales Manager",
    department: "Commercial",
    location: "Delhi NCR / Pan India",
    employment_type: "Full-time",
    experience: "3-7 Years",
    qualifications: "Graduate / MBA Marketing preferred",
    description: "Managing institutional hospital tenders, corporate pharmacy supply contracts, and large-scale distributor relationships across North India.",
    responsibilities: [
      "Identify, bid on, and secure institutional government and private hospital rate contracts & tenders.",
      "Develop and maintain strategic partnerships with super-specialty hospital procurement heads and distributors.",
      "Achieve monthly and annual sales revenue targets for Unicure generic formulations.",
      "Coordinate with supply chain and logistics teams to ensure timely delivery and payment realizations.",
    ],
    requirements: [
      "Graduate in Science/Commerce/Pharmacy, MBA in Marketing is an added advantage.",
      "3-7 years in institutional pharma sales or hospital tender management.",
      "Strong negotiation skills and existing relationships with hospital networks.",
    ],
    skills: ["Institutional Sales", "Tender Bidding", "Hospital Networks", "Key Account Management", "Negotiation"],
    apply_email: "careers@unicureindia.com",
    is_open: true,
    created_at: "2026-08-23",
  },
];

export function getLocalJobOpenings(): JobOpening[] {
  const dataDir = path.resolve(process.cwd(), "data");
  const filePath = path.resolve(dataDir, "job-openings.json");
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.error("[Careers API] Error reading job-openings.json:", err);
  }
  // Initialize with sample jobs if empty
  try {
    saveLocalJobOpenings(DEFAULT_SAMPLE_JOBS);
  } catch {}
  return DEFAULT_SAMPLE_JOBS;
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
          const jobId = url.searchParams.get("id");

          let jobs = getLocalJobOpenings();

          if (jobId) {
            const found = jobs.find((j) => j.id === jobId);
            if (!found) {
              return new Response(
                JSON.stringify({ success: false, message: "Job not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(
              JSON.stringify({ success: true, job: found }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (!showAll) {
            jobs = jobs.filter((j) => j.is_open);
          }
          return new Response(
            JSON.stringify({ success: true, count: jobs.length, jobs }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err.message || "Failed to fetch jobs", jobs: [] }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          let body: any;
          try {
            body = await request.json();
          } catch {
            return new Response(
              JSON.stringify({ success: false, message: "Invalid JSON body" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const action = body.action || (body.id ? "update" : "create");
          let jobs = getLocalJobOpenings();

          if (action === "create" || action === "create-job") {
            const rawJob = body.job || body;
            if (!rawJob.title?.trim()) {
              return new Response(
                JSON.stringify({ success: false, message: "Job title is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            const newJob: JobOpening = {
              id: rawJob.id || `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              title: rawJob.title.trim(),
              department: (rawJob.department || "General").trim(),
              location: (rawJob.location || "Noida, UP").trim(),
              employment_type: rawJob.employment_type || "Full-time",
              experience: rawJob.experience || "2-5 Years",
              qualifications: rawJob.qualifications || "B.Pharma / Chemistry Graduate",
              description: (rawJob.description || "").trim(),
              responsibilities: Array.isArray(rawJob.responsibilities) ? rawJob.responsibilities : undefined,
              requirements: Array.isArray(rawJob.requirements) ? rawJob.requirements : undefined,
              skills: Array.isArray(rawJob.skills) ? rawJob.skills : undefined,
              apply_email: rawJob.apply_email || "careers@unicureindia.com",
              is_open: rawJob.is_open !== undefined ? !!rawJob.is_open : true,
              created_at: new Date().toISOString().slice(0, 10),
            };

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

          if (action === "update" || action === "update-job") {
            const rawJob = body.job || body;
            const targetId = rawJob.id || body.id;
            const idx = jobs.findIndex((j) => j.id === targetId);
            if (idx === -1) {
              return new Response(
                JSON.stringify({ success: false, message: "Job not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
              );
            }

            jobs[idx] = {
              ...jobs[idx],
              title: (rawJob.title || jobs[idx].title).trim(),
              department: (rawJob.department || jobs[idx].department).trim(),
              location: (rawJob.location || jobs[idx].location).trim(),
              employment_type: rawJob.employment_type || jobs[idx].employment_type,
              experience: rawJob.experience !== undefined ? rawJob.experience : jobs[idx].experience,
              qualifications: rawJob.qualifications !== undefined ? rawJob.qualifications : jobs[idx].qualifications,
              description: (rawJob.description || jobs[idx].description).trim(),
              responsibilities: Array.isArray(rawJob.responsibilities) ? rawJob.responsibilities : jobs[idx].responsibilities,
              requirements: Array.isArray(rawJob.requirements) ? rawJob.requirements : jobs[idx].requirements,
              skills: Array.isArray(rawJob.skills) ? rawJob.skills : jobs[idx].skills,
              apply_email: rawJob.apply_email || jobs[idx].apply_email,
              is_open: rawJob.is_open !== undefined ? !!rawJob.is_open : jobs[idx].is_open,
            };

            saveLocalJobOpenings(jobs);

            return new Response(
              JSON.stringify({
                success: true,
                message: "Job opening updated successfully.",
                job: jobs[idx],
                jobs,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "toggle" || action === "toggle-job") {
            const targetId = body.id || (body.job && body.job.id);
            const job = jobs.find((j) => j.id === targetId);
            if (!job) {
              return new Response(
                JSON.stringify({ success: false, message: "Job not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
              );
            }

            job.is_open = !job.is_open;
            saveLocalJobOpenings(jobs);

            return new Response(
              JSON.stringify({
                success: true,
                message: `Job is now ${job.is_open ? "Active" : "Closed"}.`,
                job,
                jobs,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "delete" || action === "delete-job") {
            const targetId = body.id || (body.job && body.job.id);
            jobs = jobs.filter((j) => j.id !== targetId);
            saveLocalJobOpenings(jobs);

            return new Response(
              JSON.stringify({
                success: true,
                message: "Job opening deleted.",
                jobs,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({ success: false, message: "Unrecognized action." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err.message || "Failed to process job request" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
