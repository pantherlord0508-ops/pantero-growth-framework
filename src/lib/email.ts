/**
 * @module email
 *
 * Transactional and bulk email utilities for the Pantero waitlist application.
 *
 * Built on top of [Resend](https://resend.com), this module provides:
 *
 * * Branded HTML email templates (welcome, milestone).
 * * Helper functions for generating referral & social-share links.
 * * High-level senders that wrap Resend's API with error handling.
 *
 * Required environment variables:
 *
 * | Variable | Purpose |
 * |---|---|
 * | `RESEND_API_KEY` | API key for the Resend email service |
 * | `SMTP_FROM` | Custom "from" address (defaults to `onboarding@resend.dev`) |
 * | `NEXT_PUBLIC_APP_URL` | Base URL used in referral links |
 * | `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` | WhatsApp community channel link |
 */
import { Resend } from "resend";

/** Pantero brand colours and design tokens used across email templates. */
const BRAND = {
  bgDark: "#0a0e17",
  gold: "#c9a54e",
  goldLight: "#e2c87e",
  textLight: "#ebe6da",
  textMuted: "#9a9590",
  cardBg: "#131824",
  divider: "#1e2536",
};

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn("WARNING: RESEND_API_KEY is missing from environment variables. Email functionality will fail.");
}
const resend = new Resend(resendApiKey);

// Default sender - IMPORTANT: Change this once your domain is verified in Resend dashboard
const DEFAULT_FROM = process.env.SMTP_FROM || "Pantero <onboarding@resend.dev>";

/**
 * Returns the application base URL from the environment, falling back to
 * `http://localhost:3000` during local development.
 *
 * @returns The public URL of the Pantero application.
 */
function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Returns the Pantero WhatsApp community channel URL from the environment,
 * falling back to the default channel link.
 *
 * @returns The WhatsApp channel invite URL.
 */
function getWhatsAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ||
    "https://whatsapp.com/channel/0029Vb7o3mAI1rcqOL8Fgg0Z"
  );
}

/**
 * Wraps an email body fragment inside the full Pantero-branded HTML document
 * template, including responsive styles, logo, and footer.
 *
 * @param body - Raw HTML string to inject into the main content area.
 * @returns A complete HTML document string ready to send as an email.
 */
function wrapEmailTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pantero</title>
  <style>
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: ${BRAND.bgDark}; }
    img { border: 0; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 0 16px !important; }
      .content { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bgDark}; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bgDark};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin:0; font-size:36px; font-weight:700; color:${BRAND.gold}; letter-spacing:4px; text-transform:uppercase;">Pantero</h1>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cardBg}; border-radius:12px; overflow:hidden;">
                <tr>
                  <td class="content" style="padding: 40px 36px;">
                    ${body}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin:0; font-size:13px; color:${BRAND.textMuted};">&copy; ${new Date().getFullYear()} Pantero. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a branded gold-gradient CTA button as an HTML table element
 * (email-client compatible).
 *
 * @param href - The URL the button links to.
 * @param label - The visible button text.
 * @returns An HTML string representing the styled CTA button.
 */
function goldButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
    <tr>
      <td align="center" style="border-radius:8px; background:linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight});">
        <a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:${BRAND.bgDark}; text-decoration:none; border-radius:8px; letter-spacing:0.5px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

/**
 * Builds a row of social-media share links (Twitter, Facebook, LinkedIn,
 * WhatsApp) pre-populated with the user's referral URL.
 *
 * @param referralCode - The user's unique referral code used to construct the
 *   share URL.
 * @returns An HTML table string containing the share links.
 */
function socialShareLinks(referralCode: string): string {
  const appUrl = getAppUrl();
  const referralUrl = `${appUrl}/referral/${referralCode}`;
  const message = encodeURIComponent(
    "I just joined the Pantero waitlist! Get early access to the next-gen platform. Use my referral link:"
  );

  const twitterUrl = `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(referralUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${message}%20${encodeURIComponent(referralUrl)}`;

  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 16px auto 0;">
    <tr>
      <td style="padding: 0 6px;">
        <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" style="color:${BRAND.gold}; text-decoration:none; font-size:14px; font-weight:600;">Twitter</a>
      </td>
      <td style="padding: 0 6px; color:${BRAND.divider};">|</td>
      <td style="padding: 0 6px;">
        <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" style="color:${BRAND.gold}; text-decoration:none; font-size:14px; font-weight:600;">Facebook</a>
      </td>
      <td style="padding: 0 6px; color:${BRAND.divider};">|</td>
      <td style="padding: 0 6px;">
        <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" style="color:${BRAND.gold}; text-decoration:none; font-size:14px; font-weight:600;">LinkedIn</a>
      </td>
      <td style="padding: 0 6px; color:${BRAND.divider};">|</td>
      <td style="padding: 0 6px;">
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="color:${BRAND.gold}; text-decoration:none; font-size:14px; font-weight:600;">WhatsApp</a>
      </td>
    </tr>
  </table>`;
}

/**
 * Minimal user data required to render the welcome email.
 */
export interface WelcomeUser {
  /** Full name of the user (first name is extracted for the greeting). */
  full_name: string;
  /** Email address to send the welcome message to. */
  email: string;
  /** Unique referral code assigned to the user. */
  referral_code: string;
  /** Current waitlist position number. */
  position: number;
}

/**
 * Generates the full HTML body for the Pantero welcome email.
 *
 * The email includes the user's waitlist position, their unique referral link,
 * a WhatsApp community join button, and social share links.
 *
 * @param user - The user data to personalise the email with.
 * @returns A complete HTML string ready to be passed to the Resend API.
 *
 * @example
 * ```ts
 * const html = getWelcomeEmailHtml({
 *   full_name: "Jane Doe",
 *   email: "jane@example.com",
 *   referral_code: "JANE-ABC123",
 *   position: 42,
 * });
 * ```
 */
export function getWelcomeEmailHtml(user: WelcomeUser): string {
  const appUrl = getAppUrl();
  const referralUrl = `${appUrl}/referral/${user.referral_code}`;
  const whatsappUrl = getWhatsAppUrl();
  const firstName = user.full_name.split(" ")[0];

  const body = `
    <p style="margin:0 0 8px; font-size:18px; color:${BRAND.textLight};">Hi <strong style="color:${BRAND.gold};">${firstName}</strong>,</p>
    <h2 style="margin:0 0 20px; font-size:24px; color:${BRAND.gold}; font-weight:700;">Welcome to Pantero!</h2>
    <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:${BRAND.textLight};">
      Congratulations! You've secured your spot on the Pantero waitlist. You're officially part of an exclusive community shaping the future.
    </p>

    <!-- Position Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td align="center" style="background-color:${BRAND.bgDark}; border:1px solid ${BRAND.divider}; border-radius:10px; padding:24px;">
          <p style="margin:0 0 4px; font-size:13px; text-transform:uppercase; letter-spacing:2px; color:${BRAND.textMuted};">Your Waitlist Position</p>
          <p style="margin:0; font-size:48px; font-weight:700; color:${BRAND.gold};">#${user.position}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px; font-size:15px; line-height:1.7; color:${BRAND.textLight};">
      Want to move up? Share your unique referral link with friends and family. Each referral bumps you higher on the list!
    </p>

    <!-- Referral Link -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:${BRAND.bgDark}; border:1px solid ${BRAND.divider}; border-radius:8px; padding:14px 18px;">
          <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:${BRAND.textMuted};">Your Referral Link</p>
          <a href="${referralUrl}" style="color:${BRAND.gold}; font-size:14px; word-break:break-all; text-decoration:none;">${referralUrl}</a>
        </td>
      </tr>
    </table>

    ${goldButton(referralUrl, "Share & Climb the Waitlist")}

    <div style="height:1px; background-color:${BRAND.divider}; margin:28px 0;"></div>

    <!-- WhatsApp -->
    <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:${BRAND.textLight}; text-align:center;">
      Join our WhatsApp community for updates, tips, and exclusive content.
    </p>
    ${goldButton(whatsappUrl, "Join WhatsApp Community")}

    <div style="height:1px; background-color:${BRAND.divider}; margin:28px 0;"></div>

    <!-- Social Sharing -->
    <p style="margin:0 0 8px; font-size:14px; color:${BRAND.textMuted}; text-align:center;">Share on social media</p>
    ${socialShareLinks(user.referral_code)}
  `;

  return wrapEmailTemplate(body);
}

/**
 * Minimal user data required to render the milestone-reached email.
 */
export interface MilestoneUser {
  /** Full name of the user (first name is extracted for the greeting). */
  full_name: string;
  /** Email address to send the milestone email to. */
  email: string;
  /** Unique referral code used to build the share URL. */
  referral_code: string;
}

/**
 * Describes a waitlist milestone that has been reached.
 */
export interface Milestone {
  /** Human-readable milestone name (e.g. "1 000 sign-ups"). */
  name: string;
  /** The referral / sign-up target that was reached. */
  target_count: number;
}

/**
 * Generates the full HTML body for a milestone-reached notification email.
 *
 * @param user - The recipient user data.
 * @param milestone - The milestone that was reached.
 * @returns A complete HTML string ready to be passed to the Resend API.
 *
 * @example
 * ```ts
 * const html = getMilestoneEmailHtml(
 *   { full_name: "Jane Doe", email: "jane@example.com", referral_code: "JANE-ABC123" },
 *   { name: "1K Members", target_count: 1000 }
 * );
 * ```
 */
export function getMilestoneEmailHtml(
  user: MilestoneUser,
  milestone: Milestone
): string {
  const appUrl = getAppUrl();
  const referralUrl = `${appUrl}/referral/${user.referral_code}`;
  const firstName = user.full_name.split(" ")[0];

  const body = `
    <p style="margin:0 0 8px; font-size:18px; color:${BRAND.textLight};">Hi <strong style="color:${BRAND.gold};">${firstName}</strong>,</p>
    <h2 style="margin:0 0 20px; font-size:24px; color:${BRAND.gold}; font-weight:700;">Milestone Achieved!</h2>
    <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:${BRAND.textLight};">
      Amazing work! Thanks to supporters like you, the Pantero community has reached a major milestone.
    </p>

    <!-- Milestone Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td align="center" style="background-color:${BRAND.bgDark}; border:1px solid ${BRAND.divider}; border-radius:10px; padding:24px;">
          <p style="margin:0 0 4px; font-size:13px; text-transform:uppercase; letter-spacing:2px; color:${BRAND.textMuted};">Milestone</p>
          <p style="margin:0 0 8px; font-size:22px; font-weight:700; color:${BRAND.gold};">${milestone.name}</p>
          <p style="margin:0; font-size:42px; font-weight:700; color:${BRAND.textLight};">${milestone.target_count.toLocaleString()}</p>
          <p style="margin:4px 0 0; font-size:14px; color:${BRAND.textMuted};">members and counting</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:${BRAND.textLight};">
      We couldn't have done it without you. Keep sharing your referral link to help us reach even greater heights!
    </p>

    ${goldButton(referralUrl, "Keep Referring")}

    <div style="height:1px; background-color:${BRAND.divider}; margin:28px 0;"></div>

    <p style="margin:0 0 8px; font-size:14px; color:${BRAND.textMuted}; text-align:center;">Share on social media</p>
    ${socialShareLinks(user.referral_code)}
  `;

  return wrapEmailTemplate(body);
}

/**
 * Sends the Pantero welcome email to a newly registered waitlist user.
 *
 * @param user - The user to welcome.
 * @throws {Error} If the Resend API call fails.
 *
 * @example
 * ```ts
 * await sendWelcomeEmail({
 *   full_name: "Jane Doe",
 *   email: "jane@example.com",
 *   referral_code: "JANE-ABC123",
 *   position: 42,
 * });
 * ```
 */
export async function sendWelcomeEmail(user: WelcomeUser): Promise<void> {
  const html = getWelcomeEmailHtml(user);

  try {
    const { error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: user.email,
      subject: "Welcome to Pantero — You're In!",
      html,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Welcome email delivery failed:", error);
    throw new Error("Welcome email delivery failed");
  }
}

/**
 * Sends a milestone-reached notification email to a waitlist user.
 *
 * @param user - The recipient user.
 * @param milestone - The milestone that was achieved.
 * @throws {Error} If the Resend API call fails.
 *
 * @example
 * ```ts
 * await sendMilestoneEmail(
 *   { full_name: "Jane Doe", email: "jane@example.com", referral_code: "JANE-ABC123" },
 *   { name: "1K Members", target_count: 1000 }
 * );
 * ```
 */
export async function sendMilestoneEmail(
  user: MilestoneUser,
  milestone: Milestone
): Promise<void> {
  const html = getMilestoneEmailHtml(user, milestone);

  try {
    const { error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: user.email,
      subject: `Pantero Milestone: ${milestone.name} Reached!`,
      html,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Milestone email delivery failed:", error);
    throw new Error("Milestone email delivery failed");
  }
}

/**
 * Sends an email to a list of recipients in batches with rate limiting.
 *
 * Uses Resend's batch API with correct array format for `to` field.
 * Adds a 1-second delay between batches to stay within Resend's rate limits.
 *
 * @param subject - The email subject line.
 * @param htmlBody - The raw HTML content for the email body (before template wrapping).
 * @param recipients - Array of recipient objects containing at least an email
 *   address and display name.
 * @returns A summary object with counts of successfully sent emails, failures,
 *   and any error messages.
 */
export async function sendBulkEmail(
  subject: string,
  htmlBody: string,
  recipients: { email: string; name: string }[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const wrappedHtml = wrapEmailTemplate(htmlBody);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  const BATCH_SIZE = 50;
  const DELAY_MS = 1000;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE).map((r) => ({
      from: DEFAULT_FROM,
      to: [r.email],
      subject,
      html: wrappedHtml,
    }));

    try {
      const { data, error } = await resend.batch.send(batch);

      if (error) {
        failed += batch.length;
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      } else if (data) {
        sent += data.length;
      }
    } catch (err: unknown) {
      failed += batch.length;
      const msg = err instanceof Error ? err.message : "Unknown error";
      errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1} fatal: ${msg}`);
    }

    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  return { sent, failed, errors };
}

