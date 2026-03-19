import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?callbackUrl=/orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: true },
          },
        },
      },
      coupon: {
        select: { code: true, discountPercent: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-20 text-center">
        <Package className="h-16 w-16 text-black/20 mx-auto mb-4" />
        <h1 className="font-display text-[40px] font-bold text-black mb-2">
          No orders yet
        </h1>
        <p className="text-base text-black/60 mb-8">
          Once you make a purchase, your orders will appear here.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand text-white px-14 py-4 rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Orders" }]} />

      <h1 className="font-display text-[40px] font-bold text-black mt-6 mb-6">
        YOUR ORDERS
      </h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-black/10 rounded-[20px] p-5 lg:p-6"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-black/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div>
                  <p className="text-sm text-black/60">Order ID</p>
                  <p className="font-mono text-sm font-medium text-black">
                    {order.id.slice(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/60">Date</p>
                  <p className="text-sm font-medium text-black">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/60">Total</p>
                  <p className="text-sm font-bold text-black">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.coupon && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand w-fit">
                    {order.coupon.code} &minus;{order.coupon.discountPercent}%
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="flex flex-col divide-y divide-black/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-[72px] h-[72px] bg-surface-alt rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={72}
                        height={72}
                        className="object-contain w-full h-full p-2"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-base text-black hover:text-black/60 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-black/60 mt-0.5">
                      Qty: {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-base text-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
