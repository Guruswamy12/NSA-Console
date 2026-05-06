import { ShieldCheck } from "lucide-react";
import type { Role } from "../../../mock/data";
// import { MOCK_ROLES } from "../../../mock/data"

export default function RolesPage() {
  const roles: Role[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex gap-2">
          {" "}
          <ShieldCheck className="h-8 w-8 text-primary" />
          Roles
        </h1>
        <p className="text-gray-500 mt-1">
          Manage team roles and access levels.
        </p>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">All Roles</h2>
            <p className="text-gray-500 mt-1 text-xs">
              A list of all roles in the system.
            </p>
          </div>
          <div className="bg-purple-50 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Role Name</th>
                <th className="text-center px-4 py-3 font-semibold">
                  Created At
                </th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
                {/* <th className="text-left px-4 py-3 font-semibold"></th> */}
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No roles found</p>
                      <p className="text-xs">
                        Roles will appear here once connected to the API.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr
                    key={role._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{role.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {role.description || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((p, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs border border-purple-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(role.createdAt).toLocaleDateString()}
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
