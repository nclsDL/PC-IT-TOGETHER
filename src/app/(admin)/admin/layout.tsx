import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "Admin | PC-IT-TOGETHER",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin role check (runs on Node.js runtime, not edge)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?callbackUrl=/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <AdminSidebar />

      {/* Content Area */}
      <div className="lg:pl-[280px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 lg:pt-10 pb-16">
          <AdminHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
