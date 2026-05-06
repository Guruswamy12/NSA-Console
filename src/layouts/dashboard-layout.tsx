import { Outlet } from "react-router-dom";
import { useState } from "react";
import { PanelLeftOpen, PanelLeftClose, PanelLeftIcon } from "lucide-react";
import AppSidebar from "../components/dashboard/app-sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#f0f4ff" }}
    >
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div
        className="flex-1 min-w-0 h-screen overflow-y-auto"
        style={{ backgroundColor: "#f0f4ff" }}
      >
        <div className="mb-4">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: " " }}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
            }}
          >
            {sidebarOpen ? (
              <PanelLeftIcon
                className="h-5 w-5"
                style={{ color: "#262729ff" }}
              />
            ) : (
              <PanelLeftIcon
                className="h-5 w-5"
                style={{ color: "#1d1d1fff" }}
              />
            )}
          </button>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
