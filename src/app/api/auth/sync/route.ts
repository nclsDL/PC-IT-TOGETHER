import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/supabase/sync-user";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await syncUser(user);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
