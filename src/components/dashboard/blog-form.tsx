import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Upload, X } from "lucide-react";
import { api } from "../../api";
import { RichTextEditor } from "../ui/rich-text-editor";
import type { Blog } from "../../mock/data";

interface Category {
  _id: string;
  name: string;
}
interface Section {
  title: string;
  content: string;
  cta: boolean;
}
interface Faq {
  question: string;
  answer: string;
}

interface FormData {
  title: string;
  h2: string;
  content: string;
  image: string;
  categoryId: string;
  keywords: string;
  excerpt: string;
  altTag: string;
  authorName: string;
  sections: Section[];
  faqs: Faq[];
}

interface BlogFormProps {
  initialData?: Blog | null;
  isEditing?: boolean;
}

const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-transparent shadow-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400 disabled:opacity-50";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || "",
    h2: initialData?.h2 || "",
    content: initialData?.initialContent || "",
    image: initialData?.image || "",
    categoryId: initialData?.categoryId?._id || "",
    keywords: initialData?.keywords || "",
    excerpt: initialData?.excerpt || "",
    altTag: initialData?.altTag || "",
    authorName: initialData?.authorName || "NorthStar Academy",
    sections:
      initialData?.sections && initialData.sections.length > 0
        ? initialData.sections
        : [{ title: "", content: "", cta: false }],
    faqs:
      initialData?.faqs && initialData.faqs.length > 0
        ? initialData.faqs
        : [{ question: "", answer: "" }],
  });

  useEffect(() => {
    api
      .getCategories()
      .then((data: unknown) => {
        const list = Array.isArray(data)
          ? data
          : (data as { data?: Category[] })?.data || [];
        setCategories(list);
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSection = () =>
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "", cta: false }],
    }));

  const updateSection = (
    index: number,
    field: keyof Section,
    value: string | boolean,
  ) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const removeSection = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));

  const addFaq = () =>
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));

  const updateFaq = (index: number, field: keyof Faq, value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const removeFaq = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await api.uploadImage(file);
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSections = formData.sections.filter((s) => s.title && s.content);
    const cleanFaqs = formData.faqs.filter((f) => f.question && f.answer);
    const payload = { ...formData, sections: cleanSections, faqs: cleanFaqs };
    try {
      const res = isEditing
        ? await api.updateBlog(initialData!._id, payload)
        : await api.createBlog(payload);
      if (res.ok) {
        navigate("/dashboard/blogs");
      } else {
        const error = await res.json();
        alert(`Failed to save blog: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to save blog", error);
      alert("An error occurred while saving the blog.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {isEditing ? "Edit Blog" : "Create New Blog"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update your blog post details."
                : "Fill in the details to create a new blog post."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/blogs")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Save className="h-4 w-4" />
            {isEditing ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Blog Details
              </h2>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <label htmlFor="categoryId" className={labelCls}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={inputCls}
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className={labelCls}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  className={inputCls}
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="h2" className={labelCls}>
                  Heading 2 / Sub-heading{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="h2"
                  name="h2"
                  className={inputCls}
                  placeholder="Enter a subtitle or H2"
                  value={formData.h2}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>
                  Initial Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, content: val }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Section
              </button>
            </div>
            {formData.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Section {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className={labelCls}>Section Title</label>
                    <input
                      className={inputCls}
                      value={section.title}
                      onChange={(e) =>
                        updateSection(index, "title", e.target.value)
                      }
                      placeholder="Section Title"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Section Content</label>
                    <RichTextEditor
                      value={section.content}
                      onChange={(val) => updateSection(index, "content", val)}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`cta-${index}`}
                      checked={section.cta}
                      onChange={(e) =>
                        updateSection(index, "cta", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Include CTA after this section?
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add FAQ
              </button>
            </div>
            {formData.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">
                    FAQ {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className={labelCls}>Question</label>
                    <input
                      className={inputCls}
                      value={faq.question}
                      onChange={(e) =>
                        updateFaq(index, "question", e.target.value)
                      }
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Answer</label>
                    <RichTextEditor
                      value={faq.answer}
                      onChange={(val) => updateFaq(index, "answer", val)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Featured Image <span className="text-red-500">*</span>
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className={labelCls}>Upload Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-7 h-7 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <input
                    ref={fileRef}
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="altTag" className={labelCls}>
                  Image Alt Tag <span className="text-red-500">*</span>
                </label>
                <input
                  id="altTag"
                  name="altTag"
                  className={inputCls}
                  placeholder="Image description"
                  value={formData.altTag}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.image && (
                <div className="relative rounded-lg overflow-hidden border border-gray-100 aspect-video group">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                    className="absolute top-2 right-2 h-7 w-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Meta Information
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label htmlFor="keywords" className={labelCls}>
                  Keywords
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  className={inputCls}
                  placeholder="Comma separated keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="excerpt" className={labelCls}>
                  Meta Description
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  className={`${inputCls} min-h-[80px] resize-none`}
                  placeholder="Short summary for SEO..."
                  value={formData.excerpt}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="authorName" className={labelCls}>
                  Author Name Override
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  className={inputCls}
                  placeholder="e.g. John Doe"
                  value={formData.authorName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
