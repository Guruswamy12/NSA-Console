import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Category } from "../../mock/data";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saved: Category) => void;
  categoryToEdit: Category | null;
  allCategories: Category[];
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
  allCategories,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("none");
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setParentId(categoryToEdit.parentId?._id || "none");
    } else {
      setName("");
      setParentId("none");
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const parentOptions = allCategories.filter(
    (c) => c._id !== categoryToEdit?._id,
  );
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selectedParent =
      parentOptions.find((c) => c._id === parentId) || null;
    const saved: Category = categoryToEdit
      ? {
          ...categoryToEdit,
          name,
          parentId:
            parentId === "none"
              ? null
              : { _id: selectedParent!._id, name: selectedParent!.name },
        }
      : {
          _id: `c${Date.now()}`,
          name,
          parentId:
            parentId === "none"
              ? null
              : { _id: selectedParent!._id, name: selectedParent!.name },
          createdAt: new Date().toISOString(),
        };
    onSuccess(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-1">
          {categoryToEdit ? "Edit Category" : "Add Category"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {categoryToEdit
            ? "Update category details."
            : "Create a new category for your blogs."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          <div className="flex justify-between gap-15 items-center">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
            <div className="flex justify-center gap-5 items-center">
            <label className="block text-sm font-medium mb-1">
              Parent Category
            </label>
            <select
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="none">None (Root Category)</option>
              {parentOptions.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
                 {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
