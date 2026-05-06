import { Users } from "lucide-react";
import type { User } from "../../../mock/data";
// import { MOCK_USERS } from "../../../mock/data"

export default function UsersPage() {
  const users: User[] = []; // TODO: replace with MOCK_USERS or API

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">
            Manage team members and their access.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">All Users</h2>
          <div className="bg-primary-light p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-center px-4 py-3 font-semibold">Email</th>
                <th className="text-center px-4 py-3 font-semibold">Role</th>
                <th className="text-center px-4 py-3 font-semibold">status</th>
                <th className="text-center px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No users found</p>
                      <p className="text-xs">
                        Users will appear here once connected to the API.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs border">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
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
