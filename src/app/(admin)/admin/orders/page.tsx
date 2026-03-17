import { prisma, withRetry } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200/50",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200/50",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200/50",
};

async function getOrders() {
  return withRetry(() =>
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
    })
  );
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <p className="text-[14px] text-dust-grey-400">
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>

      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                  >
                    <TableCell className="pl-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-[13px] text-brand hover:text-brand-dark transition-colors"
                      >
                        {order.id.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-[13px] font-medium text-dust-grey-900">
                        {order.user?.name || "Unknown"}
                      </p>
                      <p className="text-[11px] text-dust-grey-400">
                        {order.user?.email}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-dust-grey-600">
                      {order._count.items}
                    </TableCell>
                    <TableCell className="font-mono text-[13px] font-medium">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ring-1 ${
                          statusColors[order.status] || ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-[13px] text-dust-grey-400">
                      {order.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <ShoppingBag
                className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-dust-grey-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
