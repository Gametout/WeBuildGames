import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";
import useAdminPortfolios from "@/hooks/useAdminPortfolios";
import {
  BACKEND_TO_CATEGORY,
  CATEGORY_TO_BACKEND,
  JobProfileStatus,
  PortfolioDetail,
} from "@/types/portfolio";

const statusOptions = [JobProfileStatus.OPEN, JobProfileStatus.FREELANCE, JobProfileStatus.DEPLOYED];

export default function AdminPortfolios() {
  const { toast } = useToast();
  const {
    query,
    items,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    setPage,
    updateQuery,
    fetch,
    remove,
  } = useAdminPortfolios({ pageSize: 15 });

  const [deleteTarget, setDeleteTarget] = useState<PortfolioDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryOptions = useMemo(() => Object.keys(CATEGORY_TO_BACKEND).sort(), []);

  const toggleStatus = (status: JobProfileStatus) => {
    const existing = query.statuses || [];
    const next = existing.includes(status)
      ? existing.filter((s) => s !== status)
      : [...existing, status];
    updateQuery({ statuses: next });
  };

  const onCategorySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    updateQuery({ categories: selected });
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast({
        title: "Portfolio deleted",
        description: `${deleteTarget.name} was permanently removed.`,
      });

      const expectedCount = Math.max(totalElements - 1, 0);
      const fallbackPage = expectedCount > 0 && page > 0 && items.length === 1 ? page - 1 : page;
      await fetch(fallbackPage);
      setDeleteTarget(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete portfolio";
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-9 h-9 text-[#FFAB00]" />
              <h1 className="font-display text-4xl md:text-5xl text-white">
                Portfolio <span className="text-[#FFAB00]">Control</span>
              </h1>
            </div>
            <p className="text-gray-400">Search, filter, and permanently delete website portfolios.</p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-white/10 rounded-xl p-4 md:p-5 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Search Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={query.q || ""}
                    onChange={(e) => updateQuery({ q: e.target.value })}
                    placeholder="Type portfolio name..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-[#FFAB00]/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Categories</label>
                <select
                  multiple
                  value={query.categories || []}
                  onChange={onCategorySelection}
                  className="w-full h-[110px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category} className="bg-[#111]">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">Status</span>
              {statusOptions.map((status) => {
                const active = (query.statuses || []).includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      active
                        ? "bg-[#FFAB00]/20 border-[#FFAB00]/40 text-[#FFAB00]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}

              <button
                onClick={() => updateQuery({ q: "", categories: [], statuses: [] })}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Total portfolios: <span className="text-[#FFAB00] font-bold">{totalElements}</span>
              </div>
              <button
                onClick={() => fetch(page)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[#FFAB00] animate-spin" />
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-gray-300 mb-3">{error}</p>
                <button
                  onClick={() => fetch(page)}
                  className="px-4 py-2 bg-[#FFAB00] text-black font-bold rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center text-gray-400">No portfolios found for current filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Likes</th>
                      <th className="px-4 py-3">Premium</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                        <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-gray-300">{BACKEND_TO_CATEGORY[item.jobCategory]}</td>
                        <td className="px-4 py-3 text-gray-300">{item.jobStatus}</td>
                        <td className="px-4 py-3 text-gray-400">{item.location || "-"}</td>
                        <td className="px-4 py-3 text-gray-300">{item.likesCount || 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              item.isPremium ? "text-[#FFAB00] bg-[#FFAB00]/15" : "text-gray-400 bg-white/5"
                            }`}
                          >
                            {item.isPremium ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetch(Math.max(page - 1, 0))}
                  disabled={page === 0 || loading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => fetch(page + 1)}
                  disabled={loading || page + 1 >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/80" onClick={() => !isDeleting && setDeleteTarget(null)} />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md bg-[#0f0f0f] border border-red-500/30 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <Shield className="w-5 h-5" />
                    <h3 className="font-display text-xl">Confirm Hard Delete</h3>
                  </div>
                  <button
                    onClick={() => !isDeleting && setDeleteTarget(null)}
                    className="p-1.5 rounded bg-white/5 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  This will permanently remove <span className="text-white font-bold">{deleteTarget.name}</span> and
                  associated skills, socials, resume, and likes. This action cannot be undone.
                </p>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-white/5 border border-white/10 text-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete Forever
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
