import { prisma, withRetry } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductActions } from "@/components/admin/product-actions";

async function getProducts() {
  return withRetry(() =>
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    })
  );
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-dust-grey-400">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/products/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-dark active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
          {products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                  >
                    <TableCell className="pl-6">
                      <div className="w-10 h-10 rounded-lg bg-dust-grey-50 overflow-hidden flex items-center justify-center">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <Package
                            className="h-4 w-4 text-dust-grey-300"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-[13px] font-medium text-dust-grey-900 truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-dust-grey-400">
                          {product.brand}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-dust-grey-500">
                      {product.category.name}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-[13px]">
                        {product.salePrice ? (
                          <>
                            <span className="font-medium text-sale">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="ml-1.5 line-through text-dust-grey-300 text-[11px]">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[13px]">
                      <span
                        className={
                          product.stock <= 5
                            ? "text-sale font-medium"
                            : "text-dust-grey-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ring-1 ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
                            : "bg-dust-grey-50 text-dust-grey-500 ring-dust-grey-200/50"
                        }`}
                      >
                        {product.isActive ? "Active" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <ProductActions
                        productId={product.id}
                        productName={product.name}
                        isActive={product.isActive}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <Package
                className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-dust-grey-400 mb-4">
                No products yet
              </p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add your first product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
