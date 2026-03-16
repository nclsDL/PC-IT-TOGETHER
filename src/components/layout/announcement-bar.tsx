import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-brand text-white text-center py-2 px-4 text-sm font-medium">
      <span>
        Mega Sale on PC Components! Free Express Delivery on Orders Over ₱8,000
        — UP TO 50% OFF!{" "}
      </span>
      <Link href="/products" className="underline font-bold hover:text-white/90">
        Shop Now →
      </Link>
    </div>
  );
}
