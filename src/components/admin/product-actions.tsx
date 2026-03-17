"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  deleteProduct,
  toggleProductStatus,
} from "@/app/(admin)/admin/_actions/product-actions";

export function ProductActions({
  productId,
  productName,
  isActive,
}: {
  productId: string;
  productName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success("Product deleted");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const result = await toggleProductStatus(productId);
    if (result.success) {
      toast.success(isActive ? "Product deactivated" : "Product activated");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-lg text-dust-grey-400 hover:text-dust-grey-600 hover:bg-dust-grey-50 transition-all duration-300">
          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 rounded-xl p-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-black/[0.04]"
        >
          <DropdownMenuItem
            onClick={() => router.push(`/admin/products/${productId}/edit`)}
            className="rounded-lg text-[13px]"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleStatus}
            className="rounded-lg text-[13px]"
          >
            {isActive ? (
              <>
                <EyeOff className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg text-[13px] text-sale"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{productName}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
    </>
  );
}
