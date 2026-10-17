"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_FROM = process.env.RESEND_FROM || "Prince Data <onboarding@resend.dev>";

// Basic HTML sanitizer for interpolation
const escapeHtml = (str: string) =>
  str.replace(/[&<>\"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] as string));

// Add a simple text fallback generator
const htmlToText = (html: string) => html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").trim();

async function sendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string[];
}) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not set in Convex environment");
  }

  // Wrap network request for better diagnostics
  let res: Response;
  try {
    res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      // IMPORTANT: Resend expects `reply_to` (snake_case), not `replyTo`
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: htmlToText(payload.html),
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        // Pass bcc if provided
        ...(payload.bcc && payload.bcc.length > 0 ? { bcc: payload.bcc } : {}),
      }),
    });
  } catch (networkError) {
    console.error("Resend network error while sending email", {
      error: String(networkError),
      to: payload.to,
      subject: payload.subject,
    });
    throw networkError;
  }

  const responseText = await res.text().catch(() => "");
  if (!res.ok) {
    // Log detailed failure info for debugging
    console.error("Resend send failed", {
      status: res.status,
      statusText: res.statusText,
      to: payload.to,
      subject: payload.subject,
      responseBody: responseText,
      // Note: headers can include sensitive infra info; include only safe subset
      contentType: res.headers.get("content-type"),
      requestId: res.headers.get("x-request-id"),
    });
    throw new Error(
      `Resend send failed (${res.status}): ${responseText || "unknown error"}`
    );
  }

  // Log accepted response for visibility
  console.log("Resend send success:", {
    to: payload.to,
    subject: payload.subject,
    bodyPreview: payload.html.slice(0, 120),
  });
}

export const sendContactEmails = internalAction({
  args: {
    adminEmail: v.string(),
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (_ctx, { adminEmail, name, email, subject, message }) => {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject ?? "New Contact Message");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    // Admin notification
    await sendEmail({
      from: RESEND_FROM,
      to: [adminEmail],
      subject: `New Contact: ${safeSubject}`,
      html: `
        <div>
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong><br/>${safeMessage}</p>
        </div>
      `,
      replyTo: email,
    });

    // Auto-reply to sender, CC admin in the primary recipients list
    await sendEmail({
      from: RESEND_FROM,
      to: [email, adminEmail],
      subject: "Thanks for reaching out to Prince Data",
      html: `
        <div>
          <p>Hi ${safeName},</p>
          <p>Thanks for getting in touch! I've received your message and will get back to you shortly.</p>
          <hr/>
          <p><strong>Your Message:</strong></p>
          <p>${safeMessage}</p>
          <p>— Prince</p>
        </div>
      `,
    });
  },
});

export const sendBookingEmails = internalAction({
  args: {
    adminEmail: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    consultationType: v.string(),
    sessionDate: v.number(),
    sessionDuration: v.number(),
    price: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (
    _ctx,
    { adminEmail, clientName, clientEmail, consultationType, sessionDate, sessionDuration, price, message },
  ) => {
    const safeClientName = escapeHtml(clientName);
    const safeClientEmail = escapeHtml(clientEmail);
    const safeType = escapeHtml(consultationType);
    const safeMsg = escapeHtml(message ?? "").replace(/\n/g, "<br/>");
    const when = new Date(sessionDate).toLocaleString();

    // Admin notification
    await sendEmail({
      from: RESEND_FROM,
      to: [adminEmail],
      subject: `New Booking: ${safeType} with ${safeClientName}`,
      html: `
        <div>
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${safeClientName}</p>
          <p><strong>Email:</strong> ${safeClientEmail}</p>
          <p><strong>Type:</strong> ${safeType}</p>
          <p><strong>When:</strong> ${when}</p>
          <p><strong>Duration:</strong> ${sessionDuration} minutes</p>
          <p><strong>Price:</strong> $${price.toFixed(2)}</p>
          ${safeMsg ? `<p><strong>Message:</strong><br/>${safeMsg}</p>` : ""}
        </div>
      `,
      replyTo: clientEmail,
    });

    // Confirmation to requester, CC admin in the primary recipients list
    await sendEmail({
      from: RESEND_FROM,
      to: [clientEmail, adminEmail],
      subject: "Your consultation request has been received",
      html: `
        <div>
          <p>Hi ${safeClientName},</p>
          <p>Thanks for booking a ${safeType} consultation. I've received your request and will confirm the meeting details shortly.</p>
          <ul>
            <li><strong>Date/Time:</strong> ${when}</li>
            <li><strong>Duration:</strong> ${sessionDuration} minutes</li>
            <li><strong>Price:</strong> $${price.toFixed(2)}</li>
          </ul>
          ${safeMsg ? `<p><strong>Your Note:</strong><br/>${safeMsg}</p>` : ""}
          <p>— Prince</p>
        </div>
      `,
    });
  },
});

export const sendTestEmail = internalAction({
  args: {
    to: v.array(v.string()),
    subject: v.optional(v.string()),
    html: v.optional(v.string()),
  },
  handler: async (_ctx, { to, subject, html }) => {
    await sendEmail({
      from: RESEND_FROM,
      to,
      subject: subject ?? "Test Email from Prince Data",
      html: html ?? "<p>This is a test email. If you can read this, delivery is working.</p>",
    });
  },
});