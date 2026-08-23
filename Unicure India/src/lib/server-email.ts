import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const PRIMARY_ADMIN_EMAIL = "humanrealityofficial@gmail.com";

export interface ServerInquiryRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  message: string;
  inquiry_type: string;
  source: string;
  page_url?: string;
  email_status: "sent" | "failed" | "logged" | "pending";
  email_provider?: string;
  error_log?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

// Local filesystem persistent storage path
const DATA_DIR = path.resolve(process.cwd(), "data");
const INQUIRIES_FILE = path.resolve(DATA_DIR, "server-inquiries.json");

function getEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          const val = trimmed.slice(key.length + 1).trim();
          return val.replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch {}
  return undefined;
}

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("[ServerInquiry] Failed to initialize local data directory:", err);
  }
}

export function saveInquiryToLocalLedger(record: ServerInquiryRecord): void {
  try {
    ensureDataDir();
    let list: ServerInquiryRecord[] = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      list = JSON.parse(raw);
    }
    // Check if record exists, update or prepend
    const idx = list.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    if (list.length > 1000) list = list.slice(0, 1000);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[ServerInquiry] Error saving to local ledger:", err);
  }
}

export function getLocalInquiriesLedger(): ServerInquiryRecord[] {
  try {
    ensureDataDir();
    if (fs.existsSync(INQUIRIES_FILE)) {
      const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[ServerInquiry] Error reading local ledger:", err);
  }
  return [];
}

/**
 * Dispatches an email notification to humanrealityofficial@gmail.com across configured providers.
 * Returns true ONLY if a third-party transactional provider or SMTP server accepted the delivery.
 */
export async function dispatchInquiryEmail(record: ServerInquiryRecord): Promise<{
  success: boolean;
  provider: string;
  error?: string;
}> {
  const emailSubject = `New Unicure India Website Inquiry — ${record.inquiry_type}`;

  const textBody = `NEW WEBSITE INQUIRY

Source:
${record.source}

Inquiry Type:
${record.inquiry_type}

Name:
${record.name}

Company:
${record.company || "Not provided"}

Email:
${record.email}

Phone:
${record.phone || "Not provided"}

Country:
${record.country || "Not provided"}

Message:
${record.message}

Page:
${record.page_url || "/"}

Submitted:
${record.created_at}

Reply-To:
${record.email}
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f2b48; color: #ffffff; padding: 24px 32px; border-bottom: 4px solid #C8102E; }
    .badge { display: inline-block; background: #C8102E; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px; }
    .content { padding: 32px; }
    .field { margin-bottom: 18px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 600; color: #0f172a; }
    .message-box { background: #f1f5f9; border-left: 4px solid #0f2b48; padding: 16px; border-radius: 8px; margin-top: 8px; font-size: 14px; white-space: pre-wrap; color: #334155; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
    .btn { display: inline-block; background: #0f2b48; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">${record.inquiry_type}</div>
      <h1 style="margin: 0; font-size: 20px; font-weight: 700;">New Unicure India Lead</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">Source: ${record.source}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${record.name}</div>
      </div>
      <div class="field" style="display: flex; gap: 24px;">
        <div style="flex: 1;">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${record.email}" style="color: #0f2b48;">${record.email}</a></div>
        </div>
        <div style="flex: 1;">
          <div class="label">Phone Number</div>
          <div class="value">${record.phone || "Not provided"}</div>
        </div>
      </div>
      <div class="field" style="display: flex; gap: 24px;">
        <div style="flex: 1;">
          <div class="label">Company</div>
          <div class="value">${record.company || "Not provided"}</div>
        </div>
        <div style="flex: 1;">
          <div class="label">Country</div>
          <div class="value">${record.country || "Not provided"}</div>
        </div>
      </div>
      <div class="field">
        <div class="label">Requirement / Message</div>
        <div class="message-box">${record.message}</div>
      </div>
      <div class="field" style="margin-top: 24px;">
        <a href="mailto:${record.email}?subject=Re: ${encodeURIComponent(record.inquiry_type)} — Unicure India Ltd" class="btn" style="color: #ffffff;">
          Reply to ${record.name} Directly
        </a>
      </div>
    </div>
    <div class="footer">
      Received from <strong>unicureindia.com</strong> (${record.page_url || "/"}) at ${record.created_at} IST.<br>
      Lead ID: <code style="font-family: monospace;">${record.id}</code>
    </div>
  </div>
</body>
</html>
`;

  const targetEmail = getEnv("EMAIL_TO") || PRIMARY_ADMIN_EMAIL;
  const fromAddress =
    getEnv("EMAIL_FROM") ||
    (getEnv("RESEND_API_KEY")
      ? "Unicure India Inquiries <onboarding@resend.dev>"
      : "Unicure India Inquiries <inquiries@unicureindia.com>");

  // 1. Check Resend API
  const resendKey = getEnv("RESEND_API_KEY") || getEnv("EMAIL_API_KEY");
  if (resendKey) {
    try {
      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [targetEmail],
          reply_to: record.email,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        }),
      });

      // If failed due to unverified domain in fromAddress, auto-fallback to onboarding@resend.dev
      if (!res.ok && fromAddress !== "Unicure India Inquiries <onboarding@resend.dev>") {
        const errText = await res.text();
        console.warn("[ServerInquiry] Resend custom fromAddress failed, retrying with onboarding@resend.dev:", errText);
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Unicure India Inquiries <onboarding@resend.dev>",
            to: [targetEmail],
            reply_to: record.email,
            subject: emailSubject,
            text: textBody,
            html: htmlBody,
          }),
        });
      }

      if (res.ok) {
        const json = await res.json();
        return { success: true, provider: `Resend (ID: ${json.id || "ok"})` };
      }
      const errText = await res.text();
      console.warn("[ServerInquiry] Resend API Error, proceeding to fallback:", res.status, errText);
    } catch (err: any) {
      console.warn("[ServerInquiry] Resend fetch exception, proceeding to fallback:", err);
    }
  }

  // 2. Check SMTP / Nodemailer (Gmail / Custom Server)
  const smtpHost = getEnv("SMTP_HOST");
  const smtpUser = getEnv("SMTP_USER");
  const smtpPass = getEnv("SMTP_PASS") || getEnv("SMTP_PASSWORD");
  const smtpPort = Number.parseInt(getEnv("SMTP_PORT") || "587", 10);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: targetEmail,
        replyTo: record.email,
        subject: emailSubject,
        text: textBody,
        html: htmlBody,
      });

      return { success: true, provider: `SMTP (${smtpHost}, MessageId: ${info.messageId})` };
    } catch (err: any) {
      console.warn("[ServerInquiry] SMTP dispatch exception, proceeding to fallback:", err);
    }
  }

  // 3. Check Brevo / Sendinblue API
  const brevoKey = getEnv("BREVO_API_KEY");
  if (brevoKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoKey,
        },
        body: JSON.stringify({
          sender: { name: "Unicure India Ltd", email: fromAddress.includes("<") ? fromAddress.match(/<([^>]+)>/)?.[1] || "inquiries@unicureindia.com" : fromAddress },
          to: [{ email: targetEmail, name: "Unicure Administrator" }],
          replyTo: { email: record.email, name: record.name },
          subject: emailSubject,
          htmlContent: htmlBody,
          textContent: textBody,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, provider: `Brevo (MessageId: ${json.messageId || "ok"})` };
      }
      const errText = await res.text();
      console.warn("[ServerInquiry] Brevo API Error:", res.status, errText);
    } catch (err: any) {
      console.warn("[ServerInquiry] Brevo exception:", err);
    }
  }

  // 4. Output to terminal log for local development visibility
  console.log(`\n======================================================`);
  console.log(`[UNICURE INQUIRY RECEIVED - AWAITING EMAIL PROVIDER CREDENTIALS]`);
  console.log(`Target Recipient: ${PRIMARY_ADMIN_EMAIL}`);
  console.log(`Subject: ${emailSubject}`);
  console.log(`Reply-To: ${record.email}`);
  console.log(textBody);
  console.log(`======================================================\n`);

  // Explicitly return false because no live email service credentials were provided in .env
  return {
    success: false,
    provider: "Unconfigured (Awaiting RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env)",
    error:
      "No transactional email credentials found in environment (.env). Configure RESEND_API_KEY or SMTP_USER/SMTP_PASS to deliver live emails to humanrealityofficial@gmail.com. Lead is safely stored in database and local ledger.",
  };
}

/**
 * Stores inquiry record in Supabase database if connected.
 */
export async function saveInquiryToSupabase(record: ServerInquiryRecord): Promise<void> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return;

  try {
    const supabase = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    await supabase.from("inquiries" as any).insert({
      id: record.id,
      name: record.name,
      company: record.company || null,
      email: record.email,
      country: record.country || null,
      message: `[Source: ${record.source} | Type: ${record.inquiry_type} | Phone: ${record.phone || "N/A"} | Page: ${record.page_url || "/"}]\n\n${record.message}`,
      created_at: new Date().toISOString(),
    } as any);
  } catch (err) {
    // Database schema fallback
    console.warn("[ServerInquiry] Supabase database note:", err);
  }
}
