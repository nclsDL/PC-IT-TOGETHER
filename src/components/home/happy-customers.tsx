"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "I'm blown away by the quality of components I received from PC-IT-TOGETHER. From GPUs to RAM, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    rating: 5,
    text: "Finding the right PC parts used to be a challenge until I discovered PC-IT-TOGETHER. The range of options they offer is truly remarkable, catering to every build.",
  },
  {
    name: "James L.",
    rating: 5,
    text: "As someone who's always on the lookout for the latest tech, I'm thrilled to have found PC-IT-TOGETHER. The selection is diverse and always up-to-date with the latest hardware.",
  },
  {
    name: "David R.",
    rating: 4.5,
    text: "The PC Builder tool is incredible. It checked compatibility for me and made sure everything would work together. Saved me hours of research.",
  },
];

export function HappyCustomers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-brand/10 text-brand mb-5">
              Testimonials
            </span>
            <h2 className="font-display text-[40px] lg:text-[52px] font-bold text-dust-grey-900 leading-[1] tracking-[-0.02em]">
              OUR HAPPY CUSTOMERS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-black/[0.03] ring-1 ring-black/[0.04] text-dust-grey-600 hover:bg-black/[0.06] active:scale-[0.96] transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-black/[0.03] ring-1 ring-black/[0.04] text-dust-grey-600 hover:bg-black/[0.06] active:scale-[0.96] transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            /* Double Bezel Card */
            <div
              key={i}
              className="shrink-0 w-[380px] p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]"
            >
              <div className="bg-white rounded-[calc(1.5rem-3px)] px-8 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="mb-4">
                  <StarRating rating={t.rating} showValue={false} />
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <p className="font-semibold text-lg text-dust-grey-900">{t.name}</p>
                  <CircleCheck className="h-5 w-5 text-brand fill-brand stroke-white" />
                </div>
                <p className="text-[15px] text-dust-grey-500 leading-[1.7]">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
