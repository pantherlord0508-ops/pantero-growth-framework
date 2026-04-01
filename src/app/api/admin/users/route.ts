import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sortBy = searchParams.get("sort_by") || "joined_at";
  const sortOrder = searchParams.get("sort_order") || "desc";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  const { data: users, count, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    users: users || [],
    total,
    page,
    totalPages,
  });
}
