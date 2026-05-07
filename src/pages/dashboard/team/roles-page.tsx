import { useEffect, useState } from "react";
import { ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { api } from "../../../api";

type RoleRecord = Record<string, unknown>;

const getField = (obj: RoleRecord, ...keys: string[]): string => {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && val !== "") return String(val);
  }
  return "-";
};

const formatDate = (val: unknown): string => {
  if (!val) return "-";
  const d = new Date(String(val));
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const data = await api.getRoles();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.roles || [];
        setRoles(list);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
        <p className="text-gray-500 mt-1">
          Manage roles and their permissions.
        </p>
      </div>

      <div className="bg-white rounded-lg border-gray-200 shadow-xl">
        <div className="p-4 flex items-center justify-between">
           <div className="px-5">
          <h2 className="font-semibold text-gray-900">All Roles</h2>
          <p className="text-sm text-gray-700 mt-0.5">
           A list of all roles in the system.
          </p>
        </div>
          <div className="bg-purple-50 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <table className="w-full text-sm shadow-md rounded-xl border border-gray-300">
            <thead className="bg-gray-100 border-b border-gray-100">
              <tr className="">
                <th className="text-left px-4 py-3 font-semibold text-black">
                  Role Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-black">
                  Created At
                </th>
                <th className="text-right px-4 py-3 font-semibold text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-28" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No roles found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role, idx) => (
                  <tr
                    key={String(role._id ?? idx)}
                    className="border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <span className="px-2 py-1 text-primary rounded-xl text-xs font-medium border border-primary/20">
                        {getField(
                          role,
                          "role_name",
                          "name",
                          "roleName",
                          "title",
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(
                        role.createdAt ?? role.created_at ?? role.createdDate,
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
