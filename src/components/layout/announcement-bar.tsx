"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-hunter-green-800 text-white/80 text-center py-2.5 px-4 text-[13px] tracking-[0.01em] relative">
      <span className="font-normal">
        Sign up and get 20% off your first order.{" "}
      </span>
      <Link href="/signup" className="underline underline-offset-2 font-medium text-white hover:text-white/70 transition-colors duration-300">
        Sign Up Now
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-300"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
