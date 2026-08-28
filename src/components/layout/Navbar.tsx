import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import {
  Compass,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Target,
  ChevronDown,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTargetRole?: string;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeTargetRole = "Software Developer",
  onNavigate,
  currentRoute,
}) => {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header id="app-navbar" className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            id="brand-logo"
            onClick={() => onNavigate(user ? "/dashboard" : "/")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Employability<span className="text-sky-600">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                Career Guidance Framework
              </span>
            </div>
          </div>
        </div>

        {/* Center: Target Career Pill (When logged in) */}
        {user && user.isOnboarded && (
          <div
            id="active-career-pill"
            onClick={() => onNavigate("/discovery")}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:border-sky-300 transition-colors"
            title="Active target role focus. Click to explore other career tracks."
          >
            <Target className="w-3.5 h-3.5 text-sky-600" />
            <span>Target Role: <strong className="text-slate-900 dark:text-slate-100 font-bold">{activeTargetRole}</strong></span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
        )}

        {/* Right: Actions / User Account Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300 font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none mt-1 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      id="menu-nav-dashboard"
                      onClick={() => { setShowUserDropdown(false); onNavigate("/dashboard"); }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-left"
                    >
                      <Compass className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </button>

                    <button
                      id="menu-nav-profile"
                      onClick={() => { setShowUserDropdown(false); onNavigate("/profile"); }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-left"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Profile & Settings
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      id="menu-logout-btn"
                      onClick={() => { setShowUserDropdown(false); logout(); onNavigate("/"); }}
                      className="w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => onNavigate("/login")}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                id="nav-register-btn"
                onClick={() => onNavigate("/register")}
                className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
