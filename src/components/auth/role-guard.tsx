import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user) {
    navigate("/");
    return null;
  }

  const role = user.role?.toLowerCase().trim();
  let authorized = true;

  if (allowedRoles?.length) {
    authorized = allowedRoles.map((r) => r.toLowerCase().trim()).includes(role);
  } else if (restrictedRoles?.length) {
    authorized = !restrictedRoles
      .map((r) => r.toLowerCase().trim())
      .includes(role);
  }

  if (!authorized) {
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
  }

  return <>{children}</>;
}
