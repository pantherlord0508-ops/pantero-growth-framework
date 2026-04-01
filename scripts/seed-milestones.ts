import { supabaseAdmin } from "../src/lib/supabase";

const milestones = [
  { name: "Starter", description: "Unlock exclusive early-access content", target_count: 5 },
  { name: "Rising Star", description: "Move up 10 positions on the waitlist", target_count: 15 },
  { name: "Ambassador", description: "Get priority access + beta features", target_count: 20 },
  { name: "Champion", description: "Unlock lifetime premium benefits", target_count: 50 },
  { name: "Legend", description: "Founding member status + all perks", target_count: 100 },
];

async function main() {
  console.log("Seeding milestones...");

  for (const m of milestones) {
    const { data: existing } = await supabaseAdmin
      .from("milestones")
      .select("id")
      .eq("target_count", m.target_count)
      .single();

    if (existing) {
      console.log(`  Milestone "${m.name}" (${m.target_count}) already exists, skipping.`);
      continue;
    }

    const { error } = await supabaseAdmin.from("milestones").insert(m);
    if (error) {
      console.error(`  Error creating "${m.name}":`, error.message);
    } else {
      console.log(`  Created milestone: ${m.name} (${m.target_count})`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
