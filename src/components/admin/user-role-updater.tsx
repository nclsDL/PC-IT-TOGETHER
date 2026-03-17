"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserRole } from "@/app/(admin)/admin/_actions/user-actions";

export function UserRoleUpdater({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();

  const handleChange = async (newRole: string) => {
    const result = await updateUserRole(
      userId,
      newRole as "USER" | "ADMIN"
    );
    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Role updated to ${newRole}`);
      router.refresh();
    }
  };

  return (
    <select
      value={currentRole}
      onChange={(e) => handleChange(e.target.value)}
      className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold ring-1 appearance-none cursor-pointer transition-all duration-300 ${
        currentRole === "ADMIN"
          ? "bg-brand/10 text-brand ring-brand/20"
          : "bg-dust-grey-50 text-dust-grey-600 ring-dust-grey-200/50"
      }`}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
