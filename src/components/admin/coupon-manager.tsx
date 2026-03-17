"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/app/(admin)/admin/_actions/coupon-actions";

type EditCoupon = {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt: string;
};

export function CouponManager({
  editCoupon,
}: {
  editCoupon?: EditCoupon;
} = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(editCoupon?.code || "");
  const [discount, setDiscount] = useState(editCoupon?.discountPercent || 10);
  const [isActive, setIsActive] = useState(editCoupon?.isActive ?? true);
  const [expiresAt, setExpiresAt] = useState(editCoupon?.expiresAt || "");
  const isEditing = !!editCoupon;

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }
    setLoading(true);
    try {
      const data = {
        code,
        discountPercent: discount,
        isActive,
        expiresAt: expiresAt || null,
      };
      const result = isEditing
        ? await updateCoupon(editCoupon.id, data)
        : await createCoupon(data);

      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Coupon updated" : "Coupon created");
        setOpen(false);
        if (!isEditing) {
          setCode("");
          setDiscount(10);
          setIsActive(true);
          setExpiresAt("");
        }
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editCoupon) return;
    setLoading(true);
    try {
      const result = await deleteCoupon(editCoupon.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("Coupon deleted");
        setDeleteOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formFields = (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
          Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="form-input font-mono"
          placeholder="e.g. SAVE20"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
            Discount %
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="form-input"
            min={0}
            max={100}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
            Expires
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="peer sr-only"
          />
          <div className="w-10 h-6 rounded-full bg-dust-grey-200 peer-checked:bg-brand transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
          <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm peer-checked:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
        </div>
        <span className="text-[13px] font-medium text-dust-grey-600">
          Active
        </span>
      </label>
    </div>
  );

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-dust-grey-400 hover:text-dust-grey-600 hover:bg-dust-grey-50 transition-all duration-300"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="p-2 rounded-lg text-dust-grey-400 hover:text-sale hover:bg-red-50 transition-all duration-300"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
            </DialogHeader>
            {formFields}
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Coupon</DialogTitle>
            </DialogHeader>
            <p className="text-[13px] text-dust-grey-500">
              Delete coupon &ldquo;{editCoupon.code}&rdquo;?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-dark active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add Coupon
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Coupon</DialogTitle>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
