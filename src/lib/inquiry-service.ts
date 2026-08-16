/**
 * Centralized Inquiry & Lead Client Service
 * Single source of truth for submitting inquiries from any form, modal, or chatbot across the website.
 */

export interface CentralInquiryPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  source?: string;
  pageUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  website?: string; // Honeypot field — must remain empty
}

export interface CentralInquiryResult {
  success: boolean;
  message: string;
  inquiryId?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and submits an inquiry to the centralized backend API endpoint (/api/inquiries).
 */
export async function submitCentralInquiry(
  payload: CentralInquiryPayload,
): Promise<CentralInquiryResult> {
  // 1. Client-Side Validation
  if (!payload.name?.trim()) {
    return { success: false, message: "Full name is required." };
  }
  if (!payload.email?.trim() || !EMAIL_RE.test(payload.email.trim())) {
    return { success: false, message: "A valid email address is required." };
  }
  if (!payload.message?.trim()) {
    return { success: false, message: "Requirement / Message is required." };
  }

  // Ensure current page URL is attached if running in browser
  const enrichedPayload: CentralInquiryPayload = {
    ...payload,
    pageUrl: payload.pageUrl || (typeof window !== "undefined" ? window.location.pathname : "/"),
    source: payload.source || "Website Inquiry Form",
    inquiryType: payload.inquiryType || "General Business Inquiry",
  };

  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedPayload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return {
        success: true,
        message:
          data.message ||
          "Thank you! Your enquiry has been received. Our team will review your request and get back to you.",
        inquiryId: data.inquiryId,
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "We couldn't complete your enquiry right now. Please try again or contact us directly at humanrealityofficial@gmail.com.",
    };
  } catch (err) {
    console.error("[CentralInquiry] Network error:", err);
    return {
      success: false,
      message:
        "Network connection error. Please try again or email humanrealityofficial@gmail.com directly.",
    };
  }
}
