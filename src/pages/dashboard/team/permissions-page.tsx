import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { api } from "../../../api";

interface Permission {
  _id: string;
  groupName: string;
  actionName: string;
  createdAt: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const data = await api.getPermissions();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.permissions || [];
        setPermissions(list);
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings2 className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage system permissions and access controls.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 shadow-sm">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-gray-900">All Permissions</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            A comprehensive list of system permissions.
          </p>
        </div>

        <div className="overflow-x-auto p-5 rounded-xl">
          <table className=" w-full text-sm shadow-md rounded-xl border border-gray-300">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Group
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Action
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-36" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  </tr>
                ))
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Settings2 className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No permissions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                permissions.map((perm) => (
                  <tr
                    key={perm._id}
                    className="border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <span className="px-2 py-1  text-primary rounded-xl text-xs font-medium border border-primary/20">
                        {perm.groupName}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {perm.actionName}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(perm.createdAt).toLocaleDateString()}
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
