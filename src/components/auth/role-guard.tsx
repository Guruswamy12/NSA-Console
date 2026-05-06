import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  restrictedRoles?: string[];
}

export default function RoleGuard({
  children,
  allowedRoles,
  restrictedRoles,
}: RoleGuardProps) {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/");
      return;
    }
    const role = user?.role?.toLowerCase().trim();
    let isAuthorized = true;
    if (allowedRoles?.length) {
      isAuthorized = allowedRoles
        .map((r) => r.toLowerCase().trim())
        .includes(role);
    } else if (restrictedRoles?.length) {
      isAuthorized = !restrictedRoles
        .map((r) => r.toLowerCase().trim())
        .includes(role);
    }
    setAuthorized(isAuthorized);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Checking permissions...
      </div>
    );

  if (!authorized)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-500 mb-8">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/dashboard/blogs")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
        >
          Go to My Blogs
        </button>
      </div>
    );

  return <>{children}</>;
}
