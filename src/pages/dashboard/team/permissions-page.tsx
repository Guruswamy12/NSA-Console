import { Settings2 } from "lucide-react";
import type { Permission } from "../../../mock/data";
// import { MOCK_PERMISSIONS } from "../../../mock/data"

export default function PermissionsPage() {
  const permissions: Permission[] = []; // TODO: replace with MOCK_PERMISSIONS or API

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex gap-2 item-center">
          <Settings2 className="h-7 w-7 text-blue-600" />
          Permissions
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Manage system permissions and access controls.
        </p>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="">
          <h2 className="font-bold text-sm">All Permissions</h2>
          <p className="text-gray-500 mt-1 text-xs">
     A comprehensive list of system permissions.
        </p>
        </div>
          <div className="bg-orange-50 p-2 rounded-full">
            <Settings2 className="h-5 w-5 text-orange-600" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm  px-4 py-4">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">
                  Group
                </th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
                {/* <th className="text-left px-4 py-3 font-semibold">Module</th> */}
                <th className="text-center px-4 py-3 font-semibold">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Settings2 className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No permissions found</p>
                      <p className="text-xs">
                        Permissions will appear here once connected to the API.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                permissions.map((perm) => (
                  <tr
                    key={perm._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                        {perm.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {perm.description || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs border border-orange-200">
                        {perm.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
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
