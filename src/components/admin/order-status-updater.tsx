"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/(admin)/admin/_actions/order-actions";

const statuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"] as const;

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200/50",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200/50",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200/50",
};

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    const result = await updateOrderStatus(
      orderId,
      newStatus as (typeof statuses)[number]
    );
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
      router.refresh();
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold ring-1 appearance-none cursor-pointer transition-all duration-300 ${statusColors[currentStatus] || ""}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
