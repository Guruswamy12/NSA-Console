import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { BlogStatusBadge } from "../../../components/dashboard/blog-status-badge";
import type { Blog } from "../../../mock/data";
// import { MOCK_BLOGS } from "../../../mock/data"

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs] = useState<Blog[]>([]); // TODO: replace with MOCK_BLOGS or API
  const [search, setSearch] = useState("");

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
          <p className="text-gray-500 mt-1">
            Manage and publish your blog posts.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/blogs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> New Blog
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="relative max-w-sm">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            /> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Image</th>
                <th className="text-center px-4 py-3 font-semibold">Title</th>
                <th className="text-center px-4 py-3 font-semibold">
                  Category
                </th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-center px-4 py-3 font-semibold">Date</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No blogs yet</p>
                      <p className="text-xs">
                        Click "New Blog" to create your first post.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{blog.title}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {blog.categoryId?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <BlogStatusBadge status={blog.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {blog.authorName || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/blogs/${blog._id}/view`)
                          }
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/blogs/${blog._id}`)
                          }
                          className="p-1.5 text-blue-500 hover:bg-primary-light rounded"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
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
      </div>
    </div>
  );
}
