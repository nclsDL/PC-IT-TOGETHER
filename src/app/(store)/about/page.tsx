import Link from "next/link";
import { Package, Target, Award, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">About</span>
      </nav>

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          PC-IT-TOGETHER was born from a simple idea: building a custom PC
          shouldn&apos;t be complicated. We&apos;re a team of PC enthusiasts
          from Manila, Philippines, dedicated to making the PC building
          experience seamless, enjoyable, and accessible to everyone.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: <Package className="h-8 w-8" />, number: "38+", label: "Products Available" },
          { icon: <Target className="h-8 w-8" />, number: "8", label: "Component Categories" },
          { icon: <Award className="h-8 w-8" />, number: "100%", label: "Compatibility Checking" },
          { icon: <ShieldCheck className="h-8 w-8" />, number: "Secure", label: "PayPal Checkout" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-lg hover:border-brand transition-all group"
          >
            <div className="text-gray-500 group-hover:text-brand transition-colors flex justify-center mb-3">
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe every gamer, creator, and professional deserves a PC
              that&apos;s perfectly tailored to their needs. Our platform combines
              cutting-edge compatibility checking with a curated selection of the
              best components on the market.
            </p>
            <p className="text-gray-600">
              From budget builds to enthusiast rigs, we ensure every component
              works together flawlessly — so you can focus on what matters most:
              using your PC.
            </p>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-xl p-8 text-center">
            <p className="text-5xl font-bold text-brand mb-2">100%</p>
            <p className="text-gray-700 font-semibold">Compatibility Guarantee</p>
            <p className="text-sm text-gray-500 mt-2">
              Every build is verified before checkout
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What We Stand For</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Quality First",
              desc: "We only stock products from trusted brands with proven track records.",
            },
            {
              title: "Community Driven",
              desc: "Built by enthusiasts, for enthusiasts. Your feedback shapes our platform.",
            },
            {
              title: "Transparent Pricing",
              desc: "No hidden fees. What you see is what you pay — plus free shipping over ₱8,000.",
            },
          ].map((value) => (
            <div key={value.title} className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-sm text-gray-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
