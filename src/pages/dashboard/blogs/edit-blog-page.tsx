import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_BLOGS } from "../../../mock/data";
import type { Blog } from "../../../mock/data";
import { BlogForm } from "../../../components/dashboard/blog-form";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
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
