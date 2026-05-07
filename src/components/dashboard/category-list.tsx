import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { api } from "../../api";
import type { Category } from "../../mock/data";
import { CategoryModal } from "./category-modal";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      const list = Array.isArray(data)
        ? data
        : data?.data || data?.categories || [];
      setCategories(list);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleSuccess = async (saved: Category) => {
    try {
      if (editingCategory) {
        await api.updateCategory(saved._id, saved);
      } else {
        await api.createCategory(saved);
      }
      await fetchCategories();
    } catch (error) {
      console.error("Failed to save category", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage your blog categories and hierarchy.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover text-sm"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

   <div className="bg-white rounded-lg border-gray-200 shadow-xl">
        <div className="p-4 flex items-center justify-between">
           <div className="px-5">
            <h2 className="font-semibold">All Categories</h2>
            <p className="text-sm text-gray-500">
              List of all categories available for blogs.
            </p>
          </div>
          <div className="bg-primary-light p-2 rounded-full">
            <Tag className="h-5 w-5 text-primary" />
          </div>
        </div>
          <div className="overflow-x-auto p-8">
          <table className="w-full text-sm shadow-md rounded-xl border border-gray-300">
            <thead className="bg-gray-100 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">
                  Parent Category
                </th>
                <th className="text-left px-4 py-3 font-semibold">
                  Created At
                </th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-sm">{cat.name}</td>
                    <td className="px-4 py-3">
                      {cat.parentId ? (
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-xl text-xs font-medium border border-primary/20">
                          {cat.parentId.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-primary hover:bg-primary-light rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        categoryToEdit={editingCategory}
        allCategories={categories}
      />
    </>
  );
}
