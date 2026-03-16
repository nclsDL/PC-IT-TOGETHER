import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-8xl font-bold text-brand mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
