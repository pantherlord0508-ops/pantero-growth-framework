import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createMilestoneSchema, updateMilestoneSchema } from "@/lib/schemas";
import { apiSuccess, handleZodError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/admin/milestones" });

export async function GET() {
  return withErrorHandling(async () => {
    log.info("Milestones list request");

    const { data: milestones, error } = await supabaseAdmin
      .from("milestones")
      .select("*")
      .order("target_count", { ascending: true });

    if (error) {
      log.error({ err: error }, "Failed to fetch milestones");
      throw error;
    }

    log.info({ count: milestones?.length ?? 0 }, "Milestones list returned");
    return apiSuccess({ milestones: milestones || [] });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json();
    const parsed = createMilestoneSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { name, description, target_count } = parsed.data;

    log.info({ name, target_count }, "Creating milestone");

    const { data: milestone, error } = await supabaseAdmin
      .from("milestones")
      .insert({
        name,
        description: description ?? null,
        target_count,
      })
      .select()
      .single();

    if (error) {
      log.error({ err: error }, "Failed to create milestone");
      throw error;
    }

    log.info({ milestoneId: milestone.id }, "Milestone created");
    return apiSuccess({ success: true, milestone }, 201);
  });
}

export async function PUT(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json();
    const parsed = updateMilestoneSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { id, name, description, target_count } = parsed.data;

    log.info({ milestoneId: id }, "Updating milestone");

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (target_count !== undefined) updateData.target_count = target_count;

    const { data: milestone, error } = await supabaseAdmin
      .from("milestones")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      log.error({ err: error, milestoneId: id }, "Failed to update milestone");
      throw error;
    }

    log.info({ milestoneId: id }, "Milestone updated");
    return apiSuccess({ success: true, milestone });
  });
}
