import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  File,
  ListFilter,
  Search,
  Users,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import { BlogStatusBadge } from "../../components/dashboard/blog-status-badge";
import { api } from "../../api";
import type { Blog } from "../../mock/data";

interface Stats {
  totalUsers: number;
  totalBlogs: number;
  activeBlogs: number;
  categoriesCount: number;
  trends: { newBlogsLast30Days: number; newUsersLast30Days: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("APPROVED");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem("user");
        const parsedUser = userStr ? JSON.parse(userStr) : null;
        if (parsedUser) setUser(parsedUser);

        const queryParams =
          parsedUser?.role === "Team Member"
            ? `?role=Team Member&userId=${parsedUser.id}`
            : "";

        const [statsData, blogsData] = await Promise.all([
          api.getStats(queryParams),
          api.getBlogs(queryParams),
        ]);

        setStats(statsData);
        const blogs = Array.isArray(blogsData)
          ? blogsData
          : blogsData?.data || blogsData?.blogs || [];
        setAllBlogs(blogs);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBlogs = allBlogs.filter((blog) => {
    if (statusFilter !== "ALL" && blog.status !== statusFilter) return false;
    const blogDate = new Date(blog.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (blogDate < sevenDaysAgo) return false;
    if (
      searchQuery &&
      !blog.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleFilterSelect = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const statCards = [
    ...(user?.role !== "Team Member"
      ? [
          {
            label: "Total Team Members",
            value: stats?.totalUsers ?? 0,
            sub: `+${stats?.trends?.newUsersLast30Days ?? 0} last 30 days`,
            subGreen: true,
            icon: <Users className="h-5 w-5 text-primary" />,
            iconBg: "bg-primary/10",
            border: "border-l-primary",
          },
        ]
      : []),
    {
      label: "Total Blogs",
      value: stats?.totalBlogs ?? 0,
      sub: `+${stats?.trends?.newBlogsLast30Days ?? 0} last 30 days`,
      subGreen: true,
      icon: <File className="h-5 w-5 text-purple-500" />,
      iconBg: "bg-purple-100",
      border: "border-l-purple-500",
    },
    {
      label: "Categories",
      value: stats?.categoriesCount ?? 0,
      sub: "Unique categories",
      subGreen: false,
      icon: <ListFilter className="h-5 w-5 text-orange-500" />,
      iconBg: "bg-orange-100",
      border: "border-l-orange-500",
    },
    {
      label: "Active Blogs",
      value: stats?.activeBlogs ?? 0,
      sub: "Published & Approved",
      subGreen: true,
      icon: <Activity className="h-5 w-5 text-green-500" />,
      iconBg: "bg-green-100",
      border: "border-l-green-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of your platform's performance.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/blogs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Blog
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border border-l-4 ${card.border} px-5 py-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 leading-snug">
                {card.label}
              </p>
              <div
                className={`h-9 w-9 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? (
                <span className="animate-pulse text-gray-300">—</span>
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs flex items-center gap-1 text-gray-400">
              {card.subGreen && (
                <TrendingUp className="h-3 w-3 text-green-500" />
              )}
              {card.subGreen ? (
                <>
                  <span className="text-green-600">
                    {card.sub.split(" ")[0]}
                  </span>
                  <span>&nbsp;{card.sub.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                card.sub
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-t-4 border-t-primary shadow-sm">
        <div className="px-6 py-5   ">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Blogs
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your blogs and view their performance.
          </p>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-xs bg-dashboard-bg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ListFilter className="h-4 w-4" /> Filter
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-20 py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Filter by Status
                  </p>
                  <hr className="my-1" />
                  {["APPROVED", "DRAFT", "ALL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleFilterSelect(s)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${statusFilter === s ? "text-primary font-medium" : "text-gray-700"}`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${statusFilter === s ? "bg-primary border-primary" : "border-gray-300"}`}
                      >
                        {statusFilter === s && (
                          <svg
                            className="h-2.5 w-2.5 text-white"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1.5 5l2.5 2.5 4.5-4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {s === "ALL"
                        ? "All"
                        : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="hidden sm:table-cell text-left px-4 py-3 font-semibold text-gray-500 w-20">
                    Image
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="hidden md:table-cell text-left px-4 py-3 font-semibold text-gray-500">
                    Category
                  </th>
                  <th className="hidden md:table-cell text-left px-4 py-3 font-semibold text-gray-500">
                    Date Posted
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">
                    Votes
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="hidden sm:table-cell px-4 py-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100 animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-8 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      No blogs found within the last 7 days with status{" "}
                      <span className="font-medium">{statusFilter}</span>.
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="hidden sm:table-cell px-4 py-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "IMG"
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                        <span className="line-clamp-1">{blog.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <BlogStatusBadge status={blog.status} />
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-xs border border-primary/20">
                          {blog.categoryId?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-400 text-xs">
                        {blog.createdAt
                          ? (() => {
                              const d = new Date(blog.createdAt);
                              return isNaN(d.getTime())
                                ? "-"
                                : format(d, "MMM d, yyyy");
                            })()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">
                        {blog.votes?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredBlogs.length > 0 && (
            <div className="flex items-center justify-end gap-2 pt-4">
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
    </div>
  );
}
