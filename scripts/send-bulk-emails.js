const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");
const dotenv = require("dotenv");

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const resend = new Resend(process.env.RESEND_API_KEY);
const CSV_FILE = "waitlist_sign_ups.csv";
const VIDEO_URL = "https://pantero.io/evolution.mp4"; // Placeholder
const THUMBNAIL_URL = "https://pantero.io/assets/evolution-thumbnail.png"; // Placeholder
const IS_DRY_RUN = process.argv.includes("--dry-run");

async function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter(l => l.trim() !== "");
  const headers = lines[0].split(",").map(h => h.trim());
  
  return lines.slice(1).map(line => {
    // Simple CSV parser for quoted fields
    const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = (parts[i] || "").replace(/^"|"$/g, "").trim();
    });
    return entry;
  });
}

function getEmailTemplate(name) {
  const firstName = name ? name.split(" ")[0] : "there";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pantero Evolution</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0e17; font-family:'Inter','Segoe UI',Arial,sans-serif; color:#ebe6da;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e17;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:36px;font-weight:700;color:#c9a54e;letter-spacing:4px;text-transform:uppercase;">Pantero</h1>
              <p style="margin:8px 0 0;font-size:12px;color:#9a9590;text-transform:uppercase;letter-spacing:2px;">Advanced Growth Intelligence</p>
            </td>
          </tr>
          
          <!-- Card Content -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#131824;border:1px solid #1e2536;border-radius:16px;overflow:hidden;box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <!-- Hero Image/Video Thumbnail -->
                <tr>
                  <td align="center" style="padding:0;">
                    <a href="${VIDEO_URL}" style="display:block;text-decoration:none;">
                      <div style="background-color:#000;position:relative;">
                        <img src="${THUMBNAIL_URL}" alt="Watch the Pantero Evolution" width="100%" style="display:block;max-width:100%;border-top-left-radius:16px;border-top-right-radius:16px;opacity:0.8;">
                        <!-- Overlaid Play Button Mockup (Simplified for HTML compatibility) -->
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;background-color:rgba(201,165,78,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow: 0 0 20px rgba(201,165,78,0.5);">
                           <div style="width: 0; height: 0; border-top: 15px solid transparent; border-left: 25px solid white; border-bottom: 15px solid transparent; margin-left:5px;"></div>
                        </div>
                      </div>
                    </a>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding:40px 36px;">
                    <p style="margin:0 0 8px;font-size:18px;color:#ebe6da;">Protocol Initialized,</p>
                    <h2 style="margin:0 0 24px;font-size:28px;line-height:1.2;color:#c9a54e;font-weight:700;">Witness the Pantero Evolution</h2>
                    
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#9a9590;">
                      Hi ${firstName}, <br><br>
                      The wait is nearly over. We've been engineering the core infrastructure of the Pantero Nexus, and we're excited to share a glimpse into the future of high-performance growth management.
                    </p>
                    
                    <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9a9590;">
                      We've attached a priority link to our latest system update video. Witness the architecture, the telemetry, and the vision behind the most advanced growth framework ever built.
                    </p>
                    
                    <div align="center">
                      <a href="${VIDEO_URL}" style="display:inline-block;padding:16px 40px;background-color:#c9a54e;color:#0a0e17;text-decoration:none;font-weight:700;border-radius:8px;text-transform:uppercase;letter-spacing:1px;font-size:14px;">Watch the Reveal</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:40px;">
              <div style="margin-bottom:16px;">
                <a href="#" style="color:#9a9590;text-decoration:none;font-size:12px;margin:0 12px;">Website</a>
                <a href="#" style="color:#9a9590;text-decoration:none;font-size:12px;margin:0 12px;">Discord</a>
                <a href="#" style="color:#9a9590;text-decoration:none;font-size:12px;margin:0 12px;">Twitter</a>
              </div>
              <p style="margin:0;font-size:11px;color:#4a4f5c;letter-spacing:1px;text-transform:uppercase;">
                &copy; ${new Date().getFullYear()} Pantero Nexus Operations. Stealth Phase 4 Launch Incoming.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function main() {
  const entries = await parseCsv(CSV_FILE);
  const emails = entries.filter(e => e.Email && e.Email.includes("@"));

  console.log(`\n--- Pantero Bulk Email System ---`);
  console.log(`Total Entries in CSV: ${entries.length}`);
  console.log(`Valid Emails to Send: ${emails.length}`);
  console.log(`Mode: ${IS_DRY_RUN ? "DRY RUN (No emails will be sent)" : "LIVE SEND"}`);
  console.log(`---------------------------------\n`);

  if (IS_DRY_RUN) {
    console.log("Recipients (First 5):");
    emails.slice(0, 5).forEach(e => console.log(`- ${e.Name || "Unknown"} <${e.Email}>`));
    console.log("...");
    return;
  }

  // Batch sending (Resend allows up to 100 per request in some tiers, but safe to do sequential or small batches)
  let successCount = 0;
  let failCount = 0;

  for (const entry of emails) {
    try {
      const { data, error } = await resend.emails.send({
        from: "Pantero <onboarding@resend.dev>",
        to: entry.Email,
        subject: "The Pantero Evolution: Stealth Phase Reveal",
        html: getEmailTemplate(entry.Name),
      });

      if (error) {
        console.error(`FAILED to send to ${entry.Email}:`, error.message);
        failCount++;
      } else {
        console.log(`SUCCESS: Sent to ${entry.Email} (ID: ${data.id})`);
        successCount++;
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`FATAL for ${entry.Email}:`, err.message);
      failCount++;
    }
  }

  console.log(`\nBulk Send Complete.`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
