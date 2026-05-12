import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { TeamProvider } from "./context/TeamContext";
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

function ProtectedLayout() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <DashboardLayout />;
}

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "blogs/new", element: <NewBlogPage /> },
      { path: "blogs/categories", element: <CategoriesPage /> },
      { path: "blogs/:id", element: <EditBlogPage /> },
      { path: "blogs/:id/view", element: <ViewBlogPage /> },
      { path: "team/users", element: <UsersPage /> },
      { path: "team/roles", element: <RolesPage /> },
      { path: "team/permissions", element: <PermissionsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <TeamProvider>
          <AppRoutes />
        </TeamProvider>
      </CategoriesProvider>
    </AuthProvider>
  );
}
