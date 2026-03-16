"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">No items to checkout</h1>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium font-mono">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Payment</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-brand">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            {paypalClientId && paypalClientId !== "your-paypal-sandbox-client-id" ? (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={async () => {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ total }),
                    });
                    const data = await res.json();
                    return data.orderId;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: data.orderID,
                        items: items.map((i) => ({
                          productId: i.id,
                          quantity: i.quantity,
                          price: i.salePrice ?? i.price,
                        })),
                      }),
                    });

                    if (res.ok) {
                      clearCart();
                      router.push("/checkout/success");
                    } else {
                      toast.error("Payment failed");
                    }
                  }}
                  onError={() => {
                    toast.error("PayPal error occurred");
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  PayPal is not configured yet. Add your PayPal Client ID to the
                  .env file.
                </p>
                <button
                  onClick={() => {
                    clearCart();
                    router.push("/checkout/success");
                  }}
                  className="mt-3 bg-brand text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
                >
                  Simulate Payment (Dev)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
