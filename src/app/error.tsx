"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
