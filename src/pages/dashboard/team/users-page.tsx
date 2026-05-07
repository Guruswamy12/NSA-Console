import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "../../../api";

interface RoleId {
  _id: string;
  roleName: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  roleId?: RoleId;
  status?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await api.getUsers();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.users || [];
        setUsers(list);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage team members and their roles.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-300 shadow-sm">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            A list of all users with access to the platform.
          </p>
        </div>

         <div className="overflow-x-auto p-5 rounded-xl">
          <table className=" w-full text-sm shadow-md rounded-xl border border-gray-300">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-black">
                  Name
                </th>
                <th className="text-left px-5 py-3 font-semibold text-black">
                  Email
                </th>
                <th className="text-left px-5 py-3 font-semibold text-black">
                  Role
                </th>
                <th className="text-left px-5 py-3 font-semibold text-black">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-semibold text-black">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-48" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const status = user.status || "Active";
                  const isActive = status.toLowerCase() === "active";
                  return (
                    <tr
                      key={user._id}
                      className="border-b border-gray-300 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-3 py-3 font-semibold text-xs text-gray-900">
                        {user.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {user.email || "-"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-xl text-xs font-medium border border-primary/20">
                          {user.roleId?.roleName || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${
                            isActive
                              ? "bg-primary/10 text-black border-primary/20"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {user.createdAt
                          ? (() => {
                              const d = new Date(user.createdAt);
                              return isNaN(d.getTime())
                                ? "-"
                                : d.toLocaleDateString();
                            })()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
