import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Category } from "../../mock/data";
import { X } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

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
    (c) => c._id !== categoryToEdit?._id
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const selectedParent =
      parentOptions.find((c) => c._id === parentId) || null;

    const saved: Category = categoryToEdit
      ? {
          ...categoryToEdit,
          name,
          parentId:
            parentId === "none"
              ? null
              : {
                  _id: selectedParent!._id,
                  name: selectedParent!.name,
                },
        }
      : {
          _id: `c${Date.now()}`,
          name,
          parentId:
            parentId === "none"
              ? null
              : {
                  _id: selectedParent!._id,
                  name: selectedParent!.name,
                },
          createdAt: new Date().toISOString(),
        };

    onSuccess(saved);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#F8F9FC] shadow-2xl border border-gray-200">
        <div className="flex items-start justify-between px-6 pt-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">
              {categoryToEdit ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              {categoryToEdit
                ? "Update category details."
                : "Create a new category for your blogs."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-5">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4 mb-6">
            <label className="text-md  font-semibold text-[#111827]">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-8 w-full rounded-lg border border-[#3B82F6] bg-white px-5 text-lg outline-none ring-4 ring-blue-100 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4 mb-6">
            <label className="text-md font-semibold text-[#111827]">
              Parent Category
            </label>

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="h-8   w-full rounded-lg border border-gray-300 bg-white px-5 text-lg text-gray-700 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">None (Root Category)</option>

              {parentOptions.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-lg border border-gray-300 bg-white px-6 text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-8 rounded-lg bg-[#0B5ED7] px-4  text-lg font-medium text-white hover:bg-[#0A58CA]"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}