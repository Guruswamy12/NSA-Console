import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  GalleryVerticalEnd,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { LucideIcon } from "lucide-react";

interface SubNavItem {
  title: string;
  url: string;
  adminOnly?: boolean;
}

interface NavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  items?: SubNavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Team Management",
    icon: Users,
    adminOnly: true,
    items: [
      { title: "Roles", url: "/dashboard/team/roles" },
      { title: "Permissions", url: "/dashboard/team/permissions" },
      { title: "Users", url: "/dashboard/team/users" },
    ],
  },
  {
    title: "Content Management",
    icon: BookOpen,
    items: [
      {
        title: "Blog Categories",
        url: "/dashboard/blogs/categories",
        adminOnly: true,
      },
      { title: "All Blogs", url: "/dashboard/blogs" },
    ],
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) =>
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isOpen) {
    const parentIcons = navItems
      .filter((item) => !(item.adminOnly && user?.role === "Team Member"))
      .map((item) => ({
        icon: item.icon,
        url: item.url ?? item.items?.[0]?.url ?? "/dashboard",
        title: item.title,
        active: item.url
          ? location.pathname === item.url
          : !!item.items?.some((sub) =>
              location.pathname.startsWith(
                sub.url.split("/").slice(0, 3).join("/"),
              ),
            ),
      }));

    return (
      <aside
        className="w-14 h-screen flex flex-col shrink-0 overflow-hidden"
        style={{ backgroundColor: "#f0f4ff", borderRight: "1px solid #c5d9f7" }}
      >
        <div className="bg-primary flex items-center justify-between px-2 py-4 shrink-0">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <GalleryVerticalEnd className="h-4 w-4 text-white" />
          </div>
          {/* <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4 text-white" />
          </button> */}
        </div>

        <nav className="flex flex-col items-center gap-3 px-2 pt-4">
          {parentIcons.map(({ icon: Icon, url, title, active }) => (
            <Link
              key={title}
              to={url}
              title={title}
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: active ? "#2563eb" : "#dce8fb" }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#c5d9f7";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#dce8fb";
              }}
            >
              <Icon
                className="h-4 w-4"
                style={{ color: active ? "#fff" : "#2563eb" }}
              />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-center pb-4 px-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: "#2563eb" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="w-60 h-screen flex flex-col shrink-0 overflow-hidden"
      style={{ backgroundColor: "#f0f4ff", borderRight: "1px solid #c5d9f7" }}
    >
      <div className="px-4 py-4 bg-primary flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <GalleryVerticalEnd className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">
              NorthStar Academy
            </p>
            <p className="text-xs text-white/70">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
        <p
          className="text-sm font-semibold px-1 mb-2"
          style={{ color: "#6b7fa3" }}
        >
          Platform
        </p>

        {navItems.map((item) => {
          if (item.adminOnly && user?.role === "Team Member") return null;

          if (!item.items) {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url!}
                className="flex items-center gap-2 px-2 py-2 rounded-lg transition-colors"
                style={{
                  color: active ? "#2563eb" : "#1e3a5f",
                  backgroundColor: active ? "#dbeafe" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                  if (!active) e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor = "transparent";
                  if (!active) e.currentTarget.style.color = "#1e3a5f";
                }}
              >
                <item.icon
                  className="h-5 w-5 shrink-0"
                  style={{ color: active ? "#2563eb" : "#2563eb" }}
                />
                <span className="text-sm font-bold">{item.title}</span>
              </Link>
            );
          }

          const subItems = item.items.filter(
            (sub) => !(sub.adminOnly && user?.role === "Team Member"),
          );

          return (
            <div key={item.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(item.title)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors"
                style={{ color: "#1e3a5f" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dbeafe";
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#1e3a5f";
                }}
              >
                <span className="flex items-center gap-2">
                  <item.icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: "#2563eb" }}
                  />
                  <span className="text-sm font-bold">{item.title}</span>
                </span>
              </button>
              {openGroups[item.title] && (
                <div
                  className="ml-3 pl-4 space-y-1"
                  style={{ borderLeft: "2px solid #93c5fd" }}
                >
                  {subItems.map((sub) => {
                    const active = location.pathname === sub.url;
                    return (
                      <Link
                        key={sub.title}
                        to={sub.url}
                        className="block px-2 py-1.5 rounded-lg text-sm transition-colors"
                        style={{
                          color: active ? "#2563eb" : "#2d4a7a",
                          fontWeight: active ? 600 : 400,
                          backgroundColor: active ? "#dbeafe" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = "#2563eb";
                            e.currentTarget.style.backgroundColor = "#dbeafe";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = "#2d4a7a";
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        {sub.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t" style={{ borderColor: "#c5d9f7" }}>
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e2ecfb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "#2563eb" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{ color: "#1e3a5f" }}
            >
              {user?.name || "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "#6b7fa3" }}>
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{ color: "#6b7fa3" }}
            className="transition-colors"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#6b7fa3";
            }}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
