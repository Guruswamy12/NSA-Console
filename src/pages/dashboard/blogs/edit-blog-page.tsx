import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api";
import type { Blog } from "../../../mock/data";
import { BlogForm } from "../../../components/dashboard/blog-form";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

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
        Loading blog...
      </div>
    );

  if (!blog)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Blog not found.
      </div>
    );

  return <BlogForm initialData={blog} isEditing={true} />;
}
