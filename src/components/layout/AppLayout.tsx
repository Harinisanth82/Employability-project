import React, { useState } from "react";
import { Navbar } from "./Navbar.js";
import { Sidebar } from "./Sidebar.js";
import { useAuth } from "../../context/AuthContext.js";

interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  activeTargetRole?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  activeTargetRole,
}) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = !!user && user.isOnboarded && currentRoute !== "/onboarding";

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeTargetRole={activeTargetRole}
        onNavigate={onNavigate}
        currentRoute={currentRoute}
      />

      <div className="flex-1 flex w-full">
        {showSidebar && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main
          id="main-content-viewport"
          className={`flex-1 min-w-0 transition-all duration-300 ${
            showSidebar ? "lg:ml-64" : ""
          } flex flex-col`}
        >
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
