import { HTK_CONTACT_EMAIL } from "@/lib/htk-config";
import type { StoredCoachingApplication } from "@/lib/coaching-application-storage";

type NotificationResult =
  | { ok: true; provider: "resend"; id: string | null }
  | { ok: false; provider: "resend"; reason: "not_configured" | "send_failed"; error?: string };

function getNotificationConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.HTK_EMAIL_FROM,
    to: process.env.HTK_NOTIFICATION_EMAIL || HTK_CONTACT_EMAIL
  };
}

export function hasCoachingApplicationNotificationConfig() {
  const config = getNotificationConfig();

  return Boolean(config.apiKey && config.from && config.to);
}

export function getCoachingApplicationNotificationStatus() {
  const config = getNotificationConfig();

  return {
    configured: Boolean(config.apiKey && config.from && config.to),
    provider: "resend" as const,
    to: config.to,
    from: config.from
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function buildHtml(application: StoredCoachingApplication) {
  const rows = [
    ["Name", application.name],
    ["Email", application.email],
    ["Submitted", formatTimestamp(application.createdAt)],
    ["Primary fitness goal", application.primaryGoal],
    ["Current physical and mental state", application.currentState],
    ["Next phase target", application.nextPhaseGoal],
    ["Time frame", application.timeFrame],
    ["Commitment level", application.commitmentLevel]
  ];

  const items = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;color:#f87171;font-size:12px;font-weight:800;text-transform:uppercase;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:12px 0;color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="background:#050505;padding:32px;font-family:Inter,Arial,sans-serif;color:#ffffff;">
      <div style="max-width:720px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);background:#090909;padding:32px;">
        <p style="margin:0 0 12px;color:#f87171;font-size:12px;font-weight:800;text-transform:uppercase;">HTK Training</p>
        <h1 style="margin:0 0 8px;font-size:30px;line-height:1.1;">New Coaching Application</h1>
        <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;">
          A new applicant just submitted the HTK coaching assessment.
        </p>
        <table style="width:100%;border-collapse:collapse;">
          ${items}
        </table>
      </div>
    </div>
  `;
}

function buildText(application: StoredCoachingApplication) {
  return [
    "HTK Training - New Coaching Application",
    "",
    `Name: ${application.name}`,
    `Email: ${application.email}`,
    `Submitted: ${formatTimestamp(application.createdAt)}`,
    "",
    `Primary fitness goal: ${application.primaryGoal}`,
    "",
    `Current physical and mental state: ${application.currentState}`,
    "",
    `Next phase target: ${application.nextPhaseGoal}`,
    "",
    `Time frame: ${application.timeFrame}`,
    `Commitment level: ${application.commitmentLevel}`
  ].join("\n");
}

export async function sendCoachingApplicationNotification(
  application: StoredCoachingApplication
): Promise<NotificationResult> {
  const config = getNotificationConfig();

  if (!config.apiKey || !config.from || !config.to) {
    return {
      ok: false,
      provider: "resend",
      reason: "not_configured"
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `coaching-application-${application.id}`
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: `New HTK coaching application: ${application.name}`,
      html: buildHtml(application),
      text: buildText(application),
      replyTo: application.email
    }),
    cache: "no-store"
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      provider: "resend",
      reason: "send_failed",
      error:
        body?.message ||
        body?.error ||
        `Email provider returned ${response.status}`
    };
  }

  return {
    ok: true,
    provider: "resend",
    id: body?.id ?? null
  };
}
