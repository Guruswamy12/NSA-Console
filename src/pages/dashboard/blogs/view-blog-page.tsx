import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { MOCK_BLOGS } from "../../../mock/data";
import type { Blog } from "../../../mock/data";
import { BlogStatusBadge } from "../../../components/dashboard/blog-status-badge";

export default function ViewBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBlog(MOCK_BLOGS.find((b) => b._id === id) || null);
      setLoading(false);
    }, 300);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard/blogs")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </button>
        <button
          onClick={() => navigate(`/dashboard/blogs/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
        >
          <Pencil className="h-4 w-4" /> Edit
        </button>
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.altTag || blog.title}
          className="w-full h-64 object-cover rounded-xl border"
        />
      )}

      <div className="bg-white rounded-xl border p-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
            {blog.h2 && <p className="text-xl text-gray-600 mt-2">{blog.h2}</p>}
          </div>
          <BlogStatusBadge status={blog.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
          {blog.authorName && <span>By {blog.authorName}</span>}
          {blog.categoryId?.name && (
            <span className="px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/30">
              {blog.categoryId.name}
            </span>
          )}
          {blog.createdAt && (
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          )}
        </div>
        {blog.excerpt && (
          <p className="text-gray-600 italic border-l-4 border-primary/30 pl-4">
            {blog.excerpt}
          </p>
        )}
        {blog.initialContent && (
          <p className="text-gray-700 leading-relaxed">{blog.initialContent}</p>
        )}
        {blog.sections?.length > 0 && (
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold">Sections</h2>
            {blog.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
        {blog.faqs?.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">FAQs</h2>
            {blog.faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <p className="font-medium text-gray-800">{faq.question}</p>
                <p className="text-gray-600 mt-1 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
        {blog.keywords && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Keywords:</span> {blog.keywords}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
