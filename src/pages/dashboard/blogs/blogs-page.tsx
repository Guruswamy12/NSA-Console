import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "../../../api";
import type { Blog } from "../../../mock/data";

const LIMIT = 10;

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = async (page: number) => {
    setLoading(true);
    try {
      const data = await api.getBlogsPaged(page, LIMIT);
      const list = Array.isArray(data) ? data : data?.data || [];
      const meta = data?.meta || {};
      const total = meta.total ?? data?.total ?? list.length;
      const pages =
        meta.pages ?? data?.totalPages ?? Math.ceil(total / LIMIT) ?? 1;
      setBlogs(list);
      setTotalBlogs(total);
      setTotalPages(pages);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.deleteBlog(id);
      fetchBlogs(currentPage);
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const getBlogDate = (blog: Blog): string => {
    const b = blog as unknown as Record<string, string>;
    return (
      b.date ||
      b.createdAt ||
      b.publishedAt ||
      b.approvedOn ||
      b.updatedAt ||
      ""
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const s = (status || "").toUpperCase();
    const styles: Record<string, string> = {
      APPROVED: "bg-green-500 text-white",
      DRAFT: "bg-yellow-400 text-white",
      PENDING: "bg-blue-400 text-white",
      REJECTED: "bg-red-500 text-white",
    };
    return (
      <span
        className={`px-3 py-0.5 rounded-full text-xs font-semibold ${styles[s] || "bg-gray-300 text-white"}`}
      >
        {s || "UNKNOWN"}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and publish blog content.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/blogs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Create New Blog
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-gray-900">All Blogs</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            View and manage all blog posts.
            {!loading && totalBlogs > 0 && (
              <span className="ml-1">({totalBlogs} total)</span>
            )}
          </p>
        </div>

        <div className="overflow-x-auto p-4 rounded-xl">
          <table className="w-full text-sm shadow-md rounded-xl border border-gray-300">
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
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No blogs yet</p>
                      <p className="text-xs">
                        Click "Create New Blog" to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b last:border-0 hover:bg-gray-50/60 transition-colors"
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
                      {blog.categoryId?.name ? (
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium border border-primary/20">
                          {blog.categoryId.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(getBlogDate(blog))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t">
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
