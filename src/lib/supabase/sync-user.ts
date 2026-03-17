import { prisma } from "@/lib/db";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUser(supabaseUser: SupabaseUser) {
  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: { email: supabaseUser.email! },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: (supabaseUser.user_metadata?.name as string) ?? null,
    },
  });
}
