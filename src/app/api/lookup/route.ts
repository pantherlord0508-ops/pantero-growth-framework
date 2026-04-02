import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

function generateReferralCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

interface CsvUser {
  email: string;
  name: string;
  phone: string;
}

function parseCsvFile(filePath: string): CsvUser[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const users: CsvUser[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(",").map(p => p.replace(/^"|"$/g, "").trim());
      if (parts.length >= 2 && parts[1].includes("@")) {
        users.push({
          email: parts[1].toLowerCase(),
          name: parts[2] || "Unknown",
          phone: parts[3] || ""
        });
      }
    }
    return users;
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        error: "Email is required"
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: existingUser } = await supabaseAdmin
      .from("waitlist_users")
      .select("id, email, full_name, referral_code, position, referral_count")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      const referralLink = `https://pantero.vercel.app/join?ref=${existingUser.referral_code}`;
      return NextResponse.json({
        success: true,
        found: true,
        source: "database",
        user: {
          email: existingUser.email,
          name: existingUser.full_name,
          referral_code: existingUser.referral_code,
          referral_link: referralLink,
          position: existingUser.position,
          referral_count: existingUser.referral_count
        }
      });
    }

    const csvPaths = [
      path.join(process.cwd(), "waitlist_sign_ups.csv"),
      path.join(process.cwd(), "waitlist_sign_ups (1).csv"),
    ];

    let csvUser: CsvUser | null = null;
    
    for (const csvPath of csvPaths) {
      const csvUsers = parseCsvFile(csvPath);
      const match = csvUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (match) {
        csvUser = match;
        break;
      }
    }

    if (csvUser) {
      const newReferralCode = generateReferralCode();
      
      const { data: lastUser } = await supabaseAdmin
        .from("waitlist_users")
        .select("position")
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      const position = (lastUser?.position || 0) + 1;

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("waitlist_users")
        .insert({
          email: normalizedEmail,
          full_name: name || csvUser.name,
          whatsapp_number: phone || csvUser.phone,
          referral_code: newReferralCode,
          position: position,
          source: "csv_recovery",
        })
        .select("id, email, full_name, referral_code, position")
        .single();

      if (insertError) {
        return NextResponse.json({
          success: false,
          error: `Failed to create user: ${insertError.message}`
        }, { status: 500 });
      }

      const referralLink = `https://pantero.vercel.app/join?ref=${newReferralCode}`;
      
      return NextResponse.json({
        success: true,
        found: true,
        source: "csv_created",
        user: {
          email: newUser.email,
          name: newUser.full_name,
          referral_code: newUser.referral_code,
          referral_link: referralLink,
          position: newUser.position,
          referral_count: 0
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: "Email not found in waitlist. Please join the waitlist first."
    }, { status: 404 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}