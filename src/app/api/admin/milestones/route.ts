import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: milestones, error } = await supabaseAdmin
    .from("milestones")
    .select("*")
    .order("target_count", { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }

  return NextResponse.json({ milestones: milestones || [] });
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, target_count } = await request.json();

    if (!name || !target_count) {
      return NextResponse.json(
        { success: false, error: "Name and target_count are required" },
        { status: 400 }
      );
    }

    const { data: milestone, error } = await supabaseAdmin
      .from("milestones")
      .insert({
        name,
        description: description || null,
        target_count,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to create milestone" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, milestone });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, target_count } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { success: false, error: "Failed to update milestone" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, milestone });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
