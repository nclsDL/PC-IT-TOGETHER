import { prisma, withRetry } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Monitor, Plus, Pencil } from "lucide-react";
import { BuildDeleteButton } from "@/components/admin/build-delete-button";

const tierColors: Record<string, string> = {
  BUDGET: "bg-dust-grey-50 text-dust-grey-600 ring-dust-grey-200/50",
  MIDRANGE: "bg-blue-50 text-blue-700 ring-blue-200/50",
  HIGHEND: "bg-amber-50 text-amber-700 ring-amber-200/50",
  ENTHUSIAST: "bg-purple-50 text-purple-700 ring-purple-200/50",
};

async function getBuilds() {
  return withRetry(() =>
    prisma.prebuiltBuild.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    })
  );
}

export default async function BuildsPage() {
  const builds = await getBuilds();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-dust-grey-400">
          {builds.length} build{builds.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/builds/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-dark active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Build
        </Link>
      </div>

      {builds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map((build) => (
            <div
              key={build.id}
              className="group p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="rounded-[calc(1.5rem-3px)] bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ring-1 ${
                      tierColors[build.tier] || ""
                    }`}
                  >
                    {build.tier}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/builds/${build.id}/edit`}
                      className="p-2 rounded-lg text-dust-grey-400 hover:text-dust-grey-600 hover:bg-dust-grey-50 transition-all duration-300"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                    <BuildDeleteButton
                      buildId={build.id}
                      buildName={build.name}
                    />
                  </div>
                </div>
                <h3 className="text-[15px] font-display font-semibold text-dust-grey-900 mb-1">
                  {build.name}
                </h3>
                <p className="text-[12px] text-dust-grey-400 line-clamp-2 mb-4">
                  {build.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-display font-bold text-dust-grey-900">
                    {formatPrice(build.price)}
                  </p>
                  <p className="text-[11px] text-dust-grey-400">
                    {build._count.products} component
                    {build._count.products !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="rounded-[calc(1.5rem-3px)] bg-white py-20 text-center">
            <Monitor
              className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
              strokeWidth={1.5}
            />
            <p className="text-[14px] text-dust-grey-400 mb-4">
              No builds yet
            </p>
            <Link
              href="/admin/builds/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Create your first build
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
