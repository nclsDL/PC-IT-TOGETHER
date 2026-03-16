import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/** Wrapper for mono-spaced price display */
export function priceClass(extra?: string): string {
  return `font-mono tracking-tight ${extra || ""}`.trim()
}
