import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_EMAIL = "nmesirionyengbaronye@gmail.com";

async function main() {
  console.log("Sending test email to:", TEST_EMAIL);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Pantero Test</title></head>
<body style="margin:0; padding:0; background-color:#0a0e17; font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e17;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:36px;font-weight:700;color:#c9a54e;letter-spacing:4px;text-transform:uppercase;">Pantero</h1>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#131824;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:40px 36px;">
                    <p style="margin:0 0 8px;font-size:18px;color:#ebe6da;">Hi <strong style="color:#c9a54e;">there</strong>,</p>
                    <h2 style="margin:0 0 20px;font-size:24px;color:#c9a54e;font-weight:700;">Email System Test</h2>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#ebe6da;">
                      This is a test email from the Pantero waitlist application. If you received this, the email system is working correctly.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                      <tr>
                        <td align="center" style="background-color:#0a0e17;border:1px solid #1e2536;border-radius:10px;padding:24px;">
                          <p style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#9a9590;">Status</p>
                          <p style="margin:0;font-size:48px;font-weight:700;color:#c9a54e;">OK</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0;font-size:13px;color:#9a9590;text-align:center;">
                      Sent at: ${new Date().toISOString()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0;font-size:13px;color:#9a9590;">&copy; ${new Date().getFullYear()} Pantero. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Pantero Nexus <onboarding@resend.dev>",
      to: TEST_EMAIL,
      subject: "Pantero Email System Test",
      html,
    });

    if (error) {
      console.error("FAILED:", JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log("SUCCESS! Email sent.");
    console.log("Resend ID:", data?.id);
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  }
}

main();
