import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminUsersQuerySchema } from "@/lib/schemas";
import { apiSuccess, handleZodError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/admin/users" });

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = adminUsersQuerySchema.safeParse(searchParams);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { search, page, limit, sort_by, sort_order } = parsed.data;

    log.info({ page, limit, sort_by, sort_order, search: search || undefined }, "Admin users list request");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query
      .order(sort_by, { ascending: sort_order === "asc" })
      .range(from, to);

    const { data: users, count, error } = await query;

    if (error) {
      log.error({ err: error }, "Failed to fetch users");
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    log.info({ total, page, totalPages }, "Admin users list returned");

    return apiSuccess({
      users: users || [],
      total,
      page,
      totalPages,
    });
  });
}
