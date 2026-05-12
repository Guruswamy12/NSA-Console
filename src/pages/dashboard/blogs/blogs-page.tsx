import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { api } from "../../../api";
import type { Blog } from "../../../mock/data";
import { useCategories } from "../../../context/CategoriesContext";

const LIMIT = 10;
const STATUS_OPTIONS = ["ALL", "APPROVED", "DRAFT", "REJECTED"] as const;
const DATE_OPTIONS = [
  "ALL",
  "Today",
  "Yesterday",
  "Tomorrow",
  "Custom",
] as const;
type DateOption = (typeof DATE_OPTIONS)[number];

interface Filters {
  title: string;
  categoryId: string;
  status: string;
  dateOption: DateOption;
  customDate: string;
}

const EMPTY_FILTERS: Filters = {
  title: "",
  categoryId: "",
  status: "ALL",
  dateOption: "ALL",
  customDate: "",
};

const offsetYMD = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const resolveDate = (option: DateOption, custom: string): string => {
  if (option === "Today") return offsetYMD(0);
  if (option === "Yesterday") return offsetYMD(-1);
  if (option === "Tomorrow") return offsetYMD(1);
  if (option === "Custom") return custom;
  return "";
};

const getCategoryName = (cat: unknown): string | null => {
  if (!cat) return null;
  if (typeof cat === "object") return (cat as { name?: string }).name ?? null;
  if (typeof cat === "string") return cat;
  return null;
};

const getBlogDate = (blog: Blog): string => {
  const b = blog as unknown as Record<string, string>;
  return (
    b.date || b.createdAt || b.publishedAt || b.approvedOn || b.updatedAt || ""
  );
};

const normalise = (b: Blog): Blog => {
  const raw = b as unknown as Record<string, unknown>;
  return {
    ...b,
    image: (b.image ?? raw.imageUrl ?? raw.featuredImage ?? null) as
      | string
      | null,
    categoryId: (b.categoryId ?? raw.category ?? null) as {
      _id: string;
      name: string;
    } | null,
    isActive: b.isActive ?? true,
  };
};

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span>{selected?.label ?? placeholder ?? "Select"}</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === opt.value
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });

  const filtersRef = useRef<Filters>({ ...EMPTY_FILTERS });
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allBlogsRef = useRef<Blog[]>([]);

  const applyAndPage = useCallback((all: Blog[], f: Filters, page: number) => {
    const dateVal = resolveDate(f.dateOption, f.customDate);

    const filtered = all.filter((b) => {
      if (
        f.title &&
        !(b.title || "").toLowerCase().includes(f.title.toLowerCase())
      )
        return false;
      if (f.categoryId) {
        const cat = b.categoryId as { _id?: string } | null;
        const id = typeof b.categoryId === "string" ? b.categoryId : cat?._id;
        if (id !== f.categoryId) return false;
      }
      if (f.status !== "ALL" && (b.status || "").toUpperCase() !== f.status)
        return false;
      if (dateVal) {
        const bRaw = b as unknown as Record<string, string>;
        const blogDate = (bRaw.date || bRaw.createdAt || "").split("T")[0];
        if (blogDate !== dateVal) return false;
      }
      return true;
    });

    const total = filtered.length;
    const pages = Math.max(Math.ceil(total / LIMIT), 1);
    const safeP = Math.min(page, pages);
    const start = (safeP - 1) * LIMIT;

    setBlogs(filtered.slice(start, start + LIMIT));
    setTotalBlogs(total);
    setTotalPages(pages);
    setCurrentPage(safeP);
  }, []);

  const fetchBlogs = useCallback(
    async (page: number, f: Filters) => {
      setLoading(true);
      try {
        // Fetch page 1 to get total pages count, then fetch remaining in parallel
        const PAGE_SIZE = 100;
        const first = await api.getBlogs(`?page=1&limit=${PAGE_SIZE}`);
        const firstList: Blog[] = Array.isArray(first?.data) ? first.data : [];
        const totalPagesCount: number = first?.meta?.pages ?? 1;

        let all: Blog[] = [...firstList];

        if (totalPagesCount > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPagesCount - 1 }, (_, i) =>
              api.getBlogs(`?page=${i + 2}&limit=${PAGE_SIZE}`),
            ),
          );
          for (const r of rest) {
            if (Array.isArray(r?.data)) all = all.concat(r.data);
          }
        }

        const norm = all.map(normalise).sort((a, b) => {
          const aRaw = a as unknown as Record<string, string>;
          const bRaw = b as unknown as Record<string, string>;
          const aDate = aRaw.date || aRaw.createdAt || "";
          const bDate = bRaw.date || bRaw.createdAt || "";
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        allBlogsRef.current = norm;
        applyAndPage(norm, f, page);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    },
    [applyAndPage],
  );

  useEffect(() => {
    fetchBlogs(1, filtersRef.current);
  }, [fetchBlogs]);

  // ── Filter helpers ────────────────────────────────────────────────────────
  const setF = (f: Filters) => {
    filtersRef.current = f;
    setFilters(f);
  };

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const next = { ...filtersRef.current, [key]: value };
    setF(next);
    applyAndPage(allBlogsRef.current, next, 1);
  };

  const handleTitleChange = (value: string) => {
    const next = { ...filtersRef.current, title: value };
    setF(next);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(
      () => applyAndPage(allBlogsRef.current, next, 1),
      400,
    );
  };

  const handleDateOptionChange = (option: DateOption) => {
    const next: Filters = {
      ...filtersRef.current,
      dateOption: option,
      customDate: "",
    };
    setF(next);
    if (option !== "Custom") applyAndPage(allBlogsRef.current, next, 1);
  };

  const handleCustomDateChange = (date: string) => {
    const next: Filters = { ...filtersRef.current, customDate: date };
    setF(next);
    if (date) applyAndPage(allBlogsRef.current, next, 1);
  };

  const clearFilters = () => {
    const reset = { ...EMPTY_FILTERS };
    setF(reset);
    applyAndPage(allBlogsRef.current, reset, 1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    applyAndPage(allBlogsRef.current, filtersRef.current, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete / toggle ───────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.deleteBlog(id);
      await fetchBlogs(1, filtersRef.current);
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const handleToggleActive = async (blog: Blog) => {
    const newState = !blog.isActive;
    const patch = (list: Blog[]) =>
      list.map((b) => (b._id === blog._id ? { ...b, isActive: newState } : b));
    allBlogsRef.current = patch(allBlogsRef.current);
    setBlogs((prev) => patch(prev));
    try {
      await api.toggleBlogActive(blog._id, newState);
    } catch (err) {
      console.error("Failed to toggle active state", err);
      const revert = (list: Blog[]) =>
        list.map((b) =>
          b._id === blog._id ? { ...b, isActive: !newState } : b,
        );
      allBlogsRef.current = revert(allBlogsRef.current);
      setBlogs((prev) => revert(prev));
    }
  };

  const hasActiveFilters =
    !!filters.title ||
    !!filters.categoryId ||
    filters.status !== "ALL" ||
    filters.dateOption !== "ALL";

  const formatDate = (val: string | undefined | null) => {
    if (!val) return "-";
    const d = new Date(val);
    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const StatusBadge = ({
    status,
    isActive,
  }: {
    status: string;
    isActive: boolean;
  }) => {
    if (!isActive)
      return (
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white">
          REJECTED
        </span>
      );
    const s = (status || "").toUpperCase();
    const map: Record<string, string> = {
      APPROVED: "bg-green-500 text-white",
      DRAFT: "bg-yellow-400 text-white",
      PENDING: "bg-blue-400 text-white",
      REJECTED: "bg-red-500 text-white",
    };
    return (
      <span
        className={`px-3 py-0.5 rounded-full text-xs font-semibold ${map[s] || "bg-gray-300 text-white"}`}
      >
        {s || "UNKNOWN"}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <FileText className="h-6 w-6 text-primary" />
            Blogs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and publish blog content.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/blogs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium transition-colors"
        >
          Create New Blog
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">All Blogs</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Loading…"
                  : `${totalBlogs} blog${totalBlogs !== 1 ? "s" : ""} found`}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search title..."
                value={filters.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400"
              />
            </div>

            <CustomSelect
              value={filters.categoryId}
              onChange={(v) => updateFilter("categoryId", v)}
              placeholder="All Categories"
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((c) => ({ value: c._id, label: c.name })),
              ]}
            />

            <CustomSelect
              value={filters.status}
              onChange={(v) => updateFilter("status", v)}
              options={STATUS_OPTIONS.map((s) => ({
                value: s,
                label: s === "ALL" ? "All Statuses" : s,
              }))}
            />

            <div className="relative">
              {filters.dateOption !== "Custom" ? (
                <CustomSelect
                  value={filters.dateOption}
                  onChange={(v) => handleDateOptionChange(v as DateOption)}
                  options={DATE_OPTIONS.map((d) => ({
                    value: d,
                    label: d === "ALL" ? "Any Date" : d,
                  }))}
                />
              ) : (
                <>
                  <input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) => handleCustomDateChange(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-700"
                    autoFocus
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleDateOptionChange("ALL");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">
                  Image
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(LIMIT)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-64" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 bg-gray-100 rounded-full animate-pulse w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No blogs found</p>
                      <p className="text-xs">
                        {hasActiveFilters
                          ? "Try adjusting your filters."
                          : 'Click "Create New Blog" to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            IMG
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 font-medium text-gray-900 max-w-xs">
                      <span className="line-clamp-1">{blog.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getCategoryName(blog.categoryId) ? (
                        <span className="px-2.5 py-0.5 bg-[#faf5ff] text-[#8201dc] rounded-xl text-xs font-medium border border-[#f4eaff]">
                          {getCategoryName(blog.categoryId)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge
                        status={blog.status}
                        isActive={blog.isActive}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-medium">
                      {formatDate(getBlogDate(blog))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/blogs/${blog._id}/view`)
                          }
                          className="p-1.5 text-primary hover:bg-primary-light rounded transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/blogs/${blog._id}`)
                          }
                          className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="w-px h-4 bg-gray-200 mx-0.5" />
                        <button
                          onClick={() => handleToggleActive(blog)}
                          title={blog.isActive ? "Deactivate" : "Activate"}
                          className="group p-1"
                        >
                          {blog.isActive ? (
                            <ToggleRight className="h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
