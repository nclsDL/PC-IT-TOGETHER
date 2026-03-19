"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Invalid email or password");
      } else {
        await fetch("/api/auth/sync", { method: "POST" }).catch(() => {});
        toast.success("Logged in successfully");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
        {/* Left Side - Product Showcase */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl min-h-[500px] relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-brand/5 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-brand/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 gap-4 p-10">
            {[
              { src: "/products/gpus/rtx-4080-super.png", label: "GPUs" },
              { src: "/products/cpus/ryzen-7-7800x3d.png", label: "CPUs" },
              { src: "/products/motherboards/asus-b650e-f.png", label: "Motherboards" },
              { src: "/products/coolers/noctua-nh-d15.png", label: "Coolers" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={120}
                  height={120}
                  className="object-contain h-[100px] w-auto"
                />
                <span className="text-xs font-semibold text-black/50 uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-sm font-semibold text-black/30 tracking-widest uppercase">
              Build Your Dream PC
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Log in to PC-IT-TOGETHER
          </h1>
          <p className="text-gray-500 mb-8">Enter your details below</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Phone Number"
                required
                className="w-full h-12 px-4 border-b border-gray-300 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full h-12 px-4 pr-10 border-b border-gray-300 text-sm focus:outline-none focus:border-brand transition-colors bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-brand text-white px-12 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 w-full"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="#"
                className="text-sm text-brand hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">Or login with</span>
            <hr className="flex-1" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
