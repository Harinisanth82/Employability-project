import React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Compass,
  Search,
  BarChart3,
  MapPin,
  GraduationCap,
  Award,
  Sparkles,
  Bot,
  Clock,
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const navSections = [
    {
      title: "Discover & Assess",
      items: [
        { id: "nav-dashboard", label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
        { id: "nav-assessment", label: "Career Assessment", route: "/assessment", icon: ClipboardCheck },
        { id: "nav-discovery", label: "Career Discovery", route: "/discovery", icon: Compass },
        { id: "nav-explorer", label: "Career Explorer", route: "/explorer", icon: Search },
      ],
    },
    {
      title: "Bridge & Build Skills",
      items: [
        { id: "nav-skills", label: "Skill Gap Analysis", route: "/skills", icon: BarChart3 },
        { id: "nav-roadmap", label: "Personalized Roadmap", route: "/roadmap", icon: MapPin },
        { id: "nav-learning", label: "Learning & Projects", route: "/learning", icon: GraduationCap },
        { id: "nav-evidence", label: "Proof of Skills", route: "/evidence", icon: Award },
      ],
    },
    {
      title: "Employability & Practice",
      items: [
        { id: "nav-employability", label: "Employability Readiness", route: "/employability", icon: Sparkles },
        { id: "nav-interview", label: "Interview Arena", route: "/interview", icon: Bot },
        { id: "nav-timeline", label: "Progress Timeline", route: "/timeline", icon: Clock },
        { id: "nav-profile", label: "Profile & Settings", route: "/profile", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-50/95 dark:bg-slate-950/95 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Navigation Link Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </h4>
              <div className="mt-2 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route || (item.route === "/explorer" && currentRoute.startsWith("/explorer"));
                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      onClick={() => {
                        onNavigate(item.route);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none text-left ${
                        isActive
                          ? "bg-sky-600 text-white shadow-sm shadow-sky-600/20"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Framework Footer Note */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          <p className="font-semibold text-slate-600 dark:text-slate-300">Employability Framework</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Systematic Readiness & Proof</p>
        </div>
      </aside>
    </>
  );
};
