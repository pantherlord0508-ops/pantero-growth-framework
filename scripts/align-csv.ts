import fs from "fs";
import path from "path";

const MAIN_CSV = "waitlist_sign_ups.csv";
const SECOND_CSV = "waitlist_sign_ups (1).csv";
const OUTPUT_CSV = "waitlist_sign_ups_aligned.csv";

interface UserEntry {
  Position: string;
  Email: string;
  Name: string;
  Phone: string;
  JoinedAt: string;
}

function parseCsvLine(line: string): UserEntry | null {
  const parts = line.split(",").map(p => p.replace(/^"|"$/g, "").trim());
  if (parts.length < 2 || parts[1] === "Email") return null;
  return {
    Position: parts[0] || "",
    Email: parts[1] || "",
    Name: parts[2] || "",
    Phone: parts[3] || "",
    JoinedAt: parts[4] || "",
  };
}

async function main() {
  const mainContent = fs.readFileSync(MAIN_CSV, "utf-8");
  const secondContent = fs.readFileSync(SECOND_CSV, "utf-8");

  const lines = mainContent.split("\n").map(l => l.trim()).filter(l => l !== "");
  const secondLines = secondContent.split("\n").map(l => l.trim()).filter(l => l !== "");

  const entries: UserEntry[] = [];

  // 1. Process clean lines from main (1-101)
  for (let i = 1; i <= 101; i++) {
     const entry = parseCsvLine(lines[i]);
     if (entry) entries.push(entry);
  }

  // 2. Process clean lines from second (102-151)
  for (let i = 1; i < secondLines.length; i++) {
     const entry = parseCsvLine(secondLines[i]);
     if (entry) entries.push(entry);
  }

  // 3. Process messy lines from main (102 onwards in refined logic)
  const messyPart = lines.slice(102); // index 102 in original 'lines' array is roughly where messy stuff starts
  // Actually, let's re-scan from where we left off.
  // The first 101 lines were clean.
  
  // A better way: Manual parsing of the rest of the file
  let idx = 102;
  while (idx < lines.length) {
    const line = lines[idx];
    
    // Pattern 1: Position, Email, Name, (Empty), Time
    // Pattern 2: Position, "NEW", Email, Name, (Empty), Time
    
    if (/^\d+$/.test(line)) { // Looks like a position
      const pos = line;
      if (lines[idx + 1] === "NEW") {
        // Pattern 2
        const email = lines[idx + 2];
        const name = lines[idx + 3];
        let time = "";
        let offset = 4;
        if (lines[idx + 4] === "deliverable" || lines[idx + 4] === "0") {
             offset = 5;
             if (lines[idx + 5] && /\d+ \w+ ago/.test(lines[idx + 5])) {
                time = lines[idx+5];
                offset = 6;
             } else {
                 time = "";
             }
        } else if (/\d+ \w+ ago/.test(lines[idx + 4])) {
           time = lines[idx + 4];
           offset = 5;
        }
        if (email.includes("@")) {
          entries.push({ Position: pos, Email: email, Name: name, Phone: "", JoinedAt: time || "Recently" });
        }
        idx += offset;
      } else {
        // Pattern 1
        const email = lines[idx + 1];
        const name = lines[idx + 2];
        let time = "";
        let offset = 3;
        if (lines[idx + 3] === "deliverable") offset = 4;
        if (lines[idx + offset] && /\d+ \w+ ago/.test(lines[idx + offset])) {
           time = lines[idx + offset];
           offset++;
        }
        if (email && email.includes("@")) {
          entries.push({ Position: pos, Email: email, Name: name, Phone: "", JoinedAt: time || "Recently" });
        }
        idx += offset;
      }
    } else if (line.includes("@")) {
      // Pattern 3: Email, Name, (Empty), Time
      const email = line;
      const name = lines[idx + 1];
      let time = "";
      let offset = 2;
      if (lines[idx+2] === "") offset = 3;
      if (lines[idx + offset] && /\d+ \w+ ago/.test(lines[idx + offset])) {
        time = lines[idx + offset];
        offset++;
      }
      entries.push({ Position: "", Email: email, Name: name, Phone: "", JoinedAt: time || "Recently" });
      idx += offset;
    } else {
      idx++;
    }
  }

  // Deduplicate and Re-index
  const uniqueEmails = new Map<string, UserEntry>();
  entries.forEach(e => {
    if (e.Email) uniqueEmails.set(e.Email.toLowerCase(), e);
  });

  const finalEntries = Array.from(uniqueEmails.values());
  finalEntries.sort((a,b) => {
      const posA = parseInt(a.Position) || 999;
      const posB = parseInt(b.Position) || 999;
      return posA - posB;
  });

  const csvContent = [
    "Position,Email,Name,Phone,Joined at",
    ...finalEntries.map((e, index) => {
      const pos = index + 1;
      return `"${pos}","${e.Email}","${e.Name}","${e.Phone}","${e.JoinedAt}"`;
    })
  ].join("\n");

  fs.writeFileSync(OUTPUT_CSV, csvContent);
  console.log(`Aligned CSV saved to ${OUTPUT_CSV} with ${finalEntries.length} entries.`);
}

main().catch(console.error);
