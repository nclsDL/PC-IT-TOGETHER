import { prisma, withRetry } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

async function getOrder(id: string) {
  return withRetry(() =>
    prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true, images: true } } } },
        coupon: true,
      },
    })
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Order Info */}
      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-[12px] text-dust-grey-400 mb-1">
                Order ID
              </p>
              <p className="font-mono text-[14px] font-medium text-dust-grey-900">
                {order.id}
              </p>
            </div>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-dust-grey-400 mb-1">
                Customer
              </p>
              <p className="text-[13px] font-medium text-dust-grey-900">
                {order.user?.name || "Unknown"}
              </p>
              <p className="text-[11px] text-dust-grey-400">
                {order.user?.email}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-dust-grey-400 mb-1">
                Total
              </p>
              <p className="text-[16px] font-display font-bold text-dust-grey-900">
                {formatPrice(order.total)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-dust-grey-400 mb-1">
                Date
              </p>
              <p className="text-[13px] text-dust-grey-600">
                {order.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {order.coupon && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-dust-grey-400 mb-1">
                  Coupon
                </p>
                <p className="text-[13px] font-mono text-brand font-medium">
                  {order.coupon.code} (-{order.coupon.discountPercent}%)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-base font-display font-semibold text-dust-grey-900 mb-4">
          Items ({order.items.length})
        </h2>
        <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="rounded-[calc(1.5rem-3px)] bg-white divide-y divide-dust-grey-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-dust-grey-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-dust-grey-400">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="font-mono text-[13px] font-medium text-dust-grey-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/admin/orders"
        className="inline-flex text-[13px] font-medium text-brand hover:text-brand-dark transition-colors duration-300"
      >
        ← Back to orders
      </Link>
    </div>
  );
}
