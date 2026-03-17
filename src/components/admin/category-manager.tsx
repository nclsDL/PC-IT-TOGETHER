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
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/(admin)/admin/_actions/category-actions";

type EditCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export function CategoryManager({
  categories: _categories,
  editCategory,
}: {
  categories: unknown[];
  editCategory?: EditCategory;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(editCategory?.name || "");
  const [description, setDescription] = useState(
    editCategory?.description || ""
  );
  const [image, setImage] = useState(editCategory?.image || "");
  const isEditing = !!editCategory;

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const result = isEditing
        ? await updateCategory(editCategory.id, { name, description, image })
        : await createCategory({ name, description, image });

      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Category updated" : "Category created");
        setOpen(false);
        if (!isEditing) {
          setName("");
          setDescription("");
          setImage("");
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
    if (!editCategory) return;
    setLoading(true);
    try {
      const result = await deleteCategory(editCategory.id);
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted");
        setDeleteOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input min-h-[80px]"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-input"
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <p className="text-[13px] text-dust-grey-500">
              Are you sure you want to delete &ldquo;{editCategory.name}
              &rdquo;?
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
        Add Category
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Category name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input min-h-[80px]"
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-input"
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
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
