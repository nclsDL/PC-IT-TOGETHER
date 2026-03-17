import { prisma, withRetry } from "@/lib/db";
import { Ticket } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CouponManager } from "@/components/admin/coupon-manager";

async function getCoupons() {
  return withRetry(() =>
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    })
  );
}

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-dust-grey-400">
          {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
        </p>
        <CouponManager />
      </div>

      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
          {coupons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow
                    key={coupon.id}
                    className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                  >
                    <TableCell className="pl-6 font-mono text-[13px] font-semibold text-dust-grey-900">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-brand font-medium">
                      {coupon.discountPercent}%
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-dust-grey-600">
                      {coupon._count.orders}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ring-1 ${
                          coupon.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
                            : "bg-dust-grey-50 text-dust-grey-500 ring-dust-grey-200/50"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-dust-grey-400">
                      {coupon.expiresAt
                        ? coupon.expiresAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never"}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <CouponManager
                        editCoupon={{
                          id: coupon.id,
                          code: coupon.code,
                          discountPercent: coupon.discountPercent,
                          isActive: coupon.isActive,
                          expiresAt: coupon.expiresAt
                            ? coupon.expiresAt.toISOString().split("T")[0]
                            : "",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <Ticket
                className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-dust-grey-400">
                No coupons yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
