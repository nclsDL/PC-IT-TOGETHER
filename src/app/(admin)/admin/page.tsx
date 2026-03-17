import { prisma, withRetry } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getStats() {
  const [productCount, orderCount, userCount, revenue, recentOrders] =
    await withRetry(() =>
      Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        }),
      ])
    );

  return {
    productCount,
    orderCount,
    userCount,
    revenue: revenue._sum.total ?? 0,
    recentOrders,
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200/50",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200/50",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200/50",
};

export default async function AdminDashboard() {
  const { productCount, orderCount, userCount, revenue, recentOrders } =
    await getStats();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      icon: DollarSign,
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Orders",
      value: orderCount.toLocaleString(),
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      label: "Users",
      value: userCount.toLocaleString(),
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="rounded-[calc(1.5rem-3px)] bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-brand/8">
                    <stat.icon
                      className="h-5 w-5 text-brand"
                      strokeWidth={1.5}
                    />
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-dust-grey-300 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.15em] font-medium text-dust-grey-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-display font-bold tracking-[-0.02em] text-dust-grey-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Add Product", href: "/admin/products/new" },
          { label: "Add Category", href: "/admin/categories" },
          { label: "Add Coupon", href: "/admin/coupons" },
          { label: "Add Build", href: "/admin/builds/new" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white ring-1 ring-black/[0.04] text-[13px] font-medium text-dust-grey-600 hover:text-brand hover:ring-brand/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_4px_16px_rgba(80,124,88,0.08)]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold tracking-[-0.01em] text-dust-grey-900">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[13px] font-medium text-brand hover:text-brand-dark transition-colors duration-300"
          >
            View all
          </Link>
        </div>

        <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
            {recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                    >
                      <TableCell className="pl-6 font-mono text-[13px]">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-brand hover:text-brand-dark transition-colors"
                        >
                          {order.id.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell className="text-[13px] text-dust-grey-600">
                        {order.user?.name || order.user?.email || "Unknown"}
                      </TableCell>
                      <TableCell className="font-mono text-[13px] font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ring-1 ${
                            statusColors[order.status] || "bg-gray-50 text-gray-600 ring-gray-200/50"
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
              <div className="py-16 text-center">
                <ShoppingBag
                  className="h-10 w-10 text-dust-grey-200 mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-[14px] text-dust-grey-400">
                  No orders yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
