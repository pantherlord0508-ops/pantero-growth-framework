import { Resend } from "resend";

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

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getWhatsAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ||
    "https://whatsapp.com/channel/0029Vb7o3mAI1rcqOL8Fgg0Z"
  );
}

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

function goldButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
    <tr>
      <td align="center" style="border-radius:8px; background:linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight});">
        <a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:${BRAND.bgDark}; text-decoration:none; border-radius:8px; letter-spacing:0.5px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

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

export interface WelcomeUser {
  full_name: string;
  email: string;
  referral_code: string;
  position: number;
}

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

export interface MilestoneUser {
  full_name: string;
  email: string;
  referral_code: string;
}

export interface Milestone {
  name: string;
  target_count: number;
}

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

export async function sendBulkEmail(
  subject: string,
  htmlBody: string,
  recipients: { email: string; name: string }[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const wrappedHtml = wrapEmailTemplate(htmlBody);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Break recipients into batches of 100 (Resend batch limit)
  const BATCH_SIZE = 100;
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE).map((r) => ({
      from: DEFAULT_FROM,
      to: r.email,
      subject,
      html: wrappedHtml,
    }));

    try {
      const { data, error } = await resend.batch.send(batch);
      
      if (error) {
        failed += batch.length;
        errors.push(`Batch failed: ${error.message}`);
      } else if (data) {
        sent += data.length;
      }
    } catch (err: any) {
      failed += batch.length;
      errors.push(`Fatal batch error: ${err.message}`);
    }
  }

  return { sent, failed, errors };
}

