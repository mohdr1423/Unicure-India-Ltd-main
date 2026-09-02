import { createFileRoute } from "@tanstack/react-router";
import {
  dispatchInquiryEmail,
  saveInquiryToLocalLedger,
  saveInquiryToSupabase,
  PRIMARY_ADMIN_EMAIL,
  type ServerInquiryRecord,
} from "@/lib/server-email";

export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          let body: any;
          try {
            body = await request.json();
          } catch {
            return new Response(
              JSON.stringify({ success: false, message: "Invalid JSON submission payload." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

          const record: ServerInquiryRecord = {
            id: inquiryId,
            created_at: timestamp,
            name: body.name || "Anonymous",
            email: body.email || "",
            company: body.company,
            phone: body.phone,
            country: body.country,
            message: body.message || "",
            inquiry_type: body.enquiryType || body.inquiryType || "General Business Inquiry",
            source: body.source || "Website Inquiry Form",
            page_url: body.pageUrl || "/contact",
            email_status: "pending",
            metadata: body.metadata,
          };

          const emailResult = await dispatchInquiryEmail(record);
          record.email_status = emailResult.success ? "sent" : "failed";
          record.email_provider = emailResult.provider;

          saveInquiryToLocalLedger(record);
          await saveInquiryToSupabase(record);

          return new Response(
            JSON.stringify({
              success: true,
              message:
                "Thank you! Your enquiry has been received. Our team will review your request and get back to you.",
              inquiryId,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("[Inquiry API Error]", err);
          return new Response(
            JSON.stringify({
              success: false,
              message: err.message || "Internal server error processing inquiry",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
