import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, User, Calendar } from "lucide-react";
import { api } from "../../../api";

type BlogRecord = Record<string, unknown>;

const StatusBadge = ({ status }: { status: string }) => {
  const s = (status || "").toUpperCase();
  const styles: Record<string, string> = {
    APPROVED: "bg-primary text-white",
    DRAFT: "bg-yellow-400 text-white",
    PENDING: "bg-blue-400 text-white",
    REJECTED: "bg-red-500 text-white",
  };
  return (
    <span
      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${styles[s] || "bg-gray-300 text-white"}`}
    >
      {s}
    </span>
  );
};

const formatDate = (val: unknown): string => {
  if (!val) return "";
  const d = new Date(String(val));
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

export default function ViewBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await api.getBlog(id);
        setBlog(data || null);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Blog not found.
      </div>
    );

  const title = String(blog.title || "");
  const h2 = String(blog.h2 || "");
  const image = String(blog.image || "");
  const altTag = String(blog.altTag || title);
  const status = String(blog.status || "");
  const authorName = String(blog.authorName || "NorthStar Academy");
  const excerpt = String(blog.excerpt || "");
  const initialContent = String(blog.initialContent || "");
  const keywords = String(blog.keywords || "");
  const slug = String(blog.slug || "");
  const categoryId = blog.categoryId as { _id?: string; name?: string } | null;
  const sections = Array.isArray(blog.sections)
    ? (blog.sections as { title: string; content: string }[])
    : [];
  const faqs = Array.isArray(blog.faqs)
    ? (blog.faqs as { question: string; answer: string }[])
    : [];
  const date = formatDate(blog.date || blog.createdAt || blog.approvedOn);

  const keywordList = keywords
    ? keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard/blogs")}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </button>
        <button
          onClick={() => navigate(`/dashboard/blogs/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Pencil className="h-4 w-4" /> Edit Blog
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-gray-100 min-h-48">
        {image ? (
          <img src={image} alt={altTag} className="w-full h-100 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        {date && (
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5" /> {date}
          </span>
        )}
      </div>
      <div className="bg-white rounded-xl border p-5 space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 leading-snug">
          {title}
        </h2>
        {h2 && <p className="text-2xl text-gray-600 font-bold">{h2}</p>}
        {authorName && (
          <p className="flex items-center gap-1.5 text-xl text-gray-400 pt-1">
            <User className="h-5 w-5" /> {authorName}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {initialContent && (
            <div className="bg-white rounded-xl border p-5">
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: initialContent }}
              />
            </div>
          )}

          {excerpt && !initialContent && (
            <div className="bg-white rounded-xl border p-5">
              <p className="text-gray-600 leading-relaxed">{excerpt}</p>
            </div>
          )}

          {sections.length > 0 && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              {sections.map((section, i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="text-base font-semibold text-gray-800 mb-1.5">
                    {section.title}
                  </h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}

          {faqs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Frequently Asked Questions
              </h3>
              <div>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 py-4 last:border-0"
                  >
                    <h4 className="text-[15px] font-semibold text-[#0B132B] leading-6">
                      {faq.question}
                    </h4>

                    <p className="mt-2 text-sm text-gray-600 leading-7">
                      {faq.answer.replace(/<[^>]*>/g, "").trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Meta Information
            </h3>

            {slug && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Slug</p>
                <p className="text-xs text-gray-600 break-all font-mono">
                  {slug}
                </p>
              </div>
            )}

            {keywordList.length > 0 && (
              <div>
                <p className="text-lg text-gray-700 font-semibold mb-2">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {keywordList.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5  text-black rounded-xl font-semibold text-xs border border-primary/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {categoryId?.name && (
              <div>
                <p className="text-lg text-gray-600 font-semibold mb-1">
                  Category ID
                </p>
                <p className="text-sm font-medium text-black">
                  {categoryId.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
