import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/login-page";
import DashboardLayout from "./layouts/dashboard-layout";
import DashboardHome from "./pages/dashboard/dashboard-home";
import BlogsPage from "./pages/dashboard/blogs/blogs-page";
import NewBlogPage from "./pages/dashboard/blogs/new-blog-page";
import EditBlogPage from "./pages/dashboard/blogs/edit-blog-page";
import ViewBlogPage from "./pages/dashboard/blogs/view-blog-page";
import CategoriesPage from "./pages/dashboard/blogs/categories-page";
import UsersPage from "./pages/dashboard/team/users-page";
import RolesPage from "./pages/dashboard/team/roles-page";
import PermissionsPage from "./pages/dashboard/team/permissions-page";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/new" element={<NewBlogPage />} />
          <Route path="blogs/categories" element={<CategoriesPage />} />
          <Route path="blogs/:id" element={<EditBlogPage />} />
          {/* <Route path="blogs/:id/view" element={<ViewBlogPage />} /> */}
          <Route path="team/users" element={<UsersPage />} />
          <Route path="team/roles" element={<RolesPage />} />
          <Route path="team/permissions" element={<PermissionsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
