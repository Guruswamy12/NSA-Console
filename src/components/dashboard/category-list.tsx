import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
// import { MOCK_CATEGORIES } from "../../mock/data"
import type { Category } from "../../mock/data";
import { CategoryModal } from "./category-modal";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]); // TODO: replace with MOCK_CATEGORIES or API
  const [loading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  const handleSuccess = (saved: Category) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c._id === saved._id ? saved : c)),
      );
    } else {
      setCategories((prev) => [...prev, saved]);
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

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">All Categories</h2>
            <p className="text-sm text-gray-500">
              List of all categories available for blogs.
            </p>
          </div>
          <div className="bg-primary-light p-2 rounded-full">
            <Tag className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
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
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3">
                      {cat.parentId ? (
                        <span className="px-2 py-0.5 bg-primary-light text-primary rounded text-xs border border-primary/30">
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
                          className="p-1.5 text-blue-500 hover:bg-primary-light rounded"
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
