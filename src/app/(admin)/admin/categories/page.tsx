import { prisma, withRetry } from "@/lib/db";
import { FolderTree } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryManager } from "@/components/admin/category-manager";

async function getCategories() {
  return withRetry(() =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    })
  );
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-dust-grey-400">
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
        </p>
        <CategoryManager categories={categories} />
      </div>

      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                  >
                    <TableCell className="pl-6">
                      <p className="text-[13px] font-medium text-dust-grey-900">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="text-[11px] text-dust-grey-400 truncate max-w-[250px]">
                          {category.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-dust-grey-400">
                      {category.slug}
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-dust-grey-600">
                      {category._count.products}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <CategoryManager
                        categories={categories}
                        editCategory={{
                          id: category.id,
                          name: category.name,
                          description: category.description || "",
                          image: category.image || "",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <FolderTree
                className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-dust-grey-400">
                No categories yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
