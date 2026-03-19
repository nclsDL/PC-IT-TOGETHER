import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="h-20 w-20 text-brand mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Order Confirmed!
      </h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. Your order has been placed successfully.
        You will receive a confirmation email shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/orders"
          className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
