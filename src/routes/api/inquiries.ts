import { createFileRoute } from "@tanstack/react-router";
import {
  dispatchInquiryEmail,
  saveInquiryToLocalLedger,
  getLocalInquiriesLedger,
  saveInquiryToSupabase,
  PRIMARY_ADMIN_EMAIL,
  type ServerInquiryRecord,
} from "@/lib/server-email";

export type InquiriesRequestBody = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  source?: string;
  pageUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  website?: string; // Honeypot
  id?: string; // For retry
  action?: string; // For retry
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 10000;
const MAX_FIELD_LEN = 500;

function sanitize(str: string | undefined, max = MAX_FIELD_LEN): string {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

// In-memory rate limiting: 30 inquiries per 5 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const MAX_SUBMISSIONS = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_SUBMISSIONS;
}

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const inquiries = getLocalInquiriesLedger();
          return new Response(
            JSON.stringify({
              success: true,
              primaryAdminEmail: PRIMARY_ADMIN_EMAIL,
              totalCount: inquiries.length,
              inquiries,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err.message, inquiries: [] }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
      POST: async ({ request }) => {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("cf-connecting-ip") ||
          "127.0.0.1";

        if (isRateLimited(ip)) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Too many submissions. Please wait a few minutes and try again.",
            }),
            { status: 429, headers: { "Content-Type": "application/json" } },
          );
        }

        let body: InquiriesRequestBody;
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ success: false, message: "Invalid request payload." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Handle Admin Retry Action
        if (body.action === "retry" && body.id) {
          const inquiries = getLocalInquiriesLedger();
          const record = inquiries.find((r) => r.id === body.id);
          if (!record) {
            return new Response(
              JSON.stringify({ success: false, message: "Inquiry not found." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const result = await dispatchInquiryEmail(record);
          record.email_status = result.success ? "sent" : "failed";
          record.email_provider = result.provider;
          record.error_log = result.error;
          saveInquiryToLocalLedger(record);

          return new Response(
            JSON.stringify({
              success: result.success,
              message: result.success
                ? `Email successfully delivered to ${PRIMARY_ADMIN_EMAIL} via ${result.provider}`
                : `Delivery unfulfilled: ${result.error}`,
              record,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }

        // Honeypot check
        if (body.website && body.website.trim().length > 0) {
          return new Response(
            JSON.stringify({ success: false, message: "Invalid submission." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Field Sanitization & Validation
        const cleanName = sanitize(body.name);
        const cleanEmail = sanitize(body.email).toLowerCase();
        const cleanMessage = sanitize(body.message, MAX_MESSAGE_LEN);
        const cleanCompany = sanitize(body.company);
        const cleanPhone = sanitize(body.phone);
        const cleanCountry = sanitize(body.country);
        const cleanType = sanitize(body.inquiryType) || "General Business Inquiry";
        const cleanSource = sanitize(body.source) || "Website Inquiry Form";
        const cleanPageUrl = sanitize(body.pageUrl) || "/";

        if (!cleanName) {
          return new Response(
            JSON.stringify({ success: false, message: "Full name is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
          return new Response(
            JSON.stringify({ success: false, message: "A valid email address is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        if (!cleanMessage) {
          return new Response(
            JSON.stringify({ success: false, message: "Please describe your requirement or message." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        const record: ServerInquiryRecord = {
          id: inquiryId,
          created_at: timestamp,
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          phone: cleanPhone,
          country: cleanCountry,
          message: cleanMessage,
          inquiry_type: cleanType,
          source: cleanSource,
          page_url: cleanPageUrl,
          email_status: "recorded",
          email_provider: "Leads Portal Direct Intake",
          metadata: body.metadata,
        };

        // Persist directly to local JSON ledger & Supabase (Visible immediately in /leads-portal)
        saveInquiryToLocalLedger(record);
        await saveInquiryToSupabase(record);

        console.log(`[Lead Intake] New Lead Captured: ${inquiryId} (${cleanName} - ${cleanType}) -> Leads Portal`);

        return new Response(
          JSON.stringify({
            success: true,
            message:
              "Thank you! Your enquiry has been received. Our team will review your request and get back to you.",
            inquiryId,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
