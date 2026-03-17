"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Contact</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand rounded-full p-2">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
              </div>
              <p className="text-sm text-gray-600 ml-12">
                We are available 24/7, 7 days a week.
              </p>
              <p className="text-sm text-gray-900 font-medium ml-12 mt-1">
                +63 912-345-6789
              </p>
            </div>

            <hr />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand rounded-full p-2">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Write To Us</h3>
              </div>
              <p className="text-sm text-gray-600 ml-12">
                Fill out the form and we will contact you within 24 hours.
              </p>
              <p className="text-sm text-gray-900 font-medium ml-12 mt-1">
                support@pcittogether.com
              </p>
            </div>

            <hr />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand rounded-full p-2">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Visit Us</h3>
              </div>
              <p className="text-sm text-gray-600 ml-12">
                Manila, Philippines
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your Name *"
                required
                className="bg-gray-50 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Your Email *"
                required
                className="bg-gray-50 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Your Phone"
                className="bg-gray-50 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Your Message *"
              required
              rows={8}
              className="w-full bg-gray-50 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none mb-6"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
