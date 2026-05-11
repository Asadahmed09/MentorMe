import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/helpers";

const getNav = (role: string) => {
  if (role === "admin")
    return [
      {
        name: "Manage Mentors",
        href: "/admin",
        icon: AcademicCapIcon,
      },
    ];
  if (role === "mentor")
    return [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Requests", href: "/dashboard/sessions", icon: CalendarIcon },
      {
        name: "Browse Mentors",
        href: "/dashboard/browse-mentors",
        icon: MagnifyingGlassIcon,
      },
      { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
    ];
  // student
  return [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    {
      name: "Browse Mentors",
      href: "/dashboard/browse-mentors",
      icon: MagnifyingGlassIcon,
    },
    { name: "My Requests", href: "/dashboard/sessions", icon: CalendarIcon },
    {
      name: "Become a Mentor",
      href: "/dashboard/become-mentor",
      icon: AcademicCapIcon,
    },
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const nav = getNav(user?.role || "student");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarBg = isAdmin ? "bg-red-900" : "bg-white";
  const sidebarBorder = isAdmin ? "border-red-800" : "border-gray-200";
  const linkActive = isAdmin
    ? "bg-red-800 text-white"
    : "bg-primary-50 text-primary-700";
  const linkIdle = isAdmin
    ? "text-red-200 hover:bg-red-800 hover:text-white"
    : "text-gray-600 hover:bg-gray-50";

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 lg:translate-x-0",
          sidebarBg,
          sidebarBorder,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "flex items-center justify-between h-16 px-4 border-b",
              sidebarBorder,
            )}
          >
            <Link to="/" className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isAdmin ? "bg-red-600" : "bg-primary-600",
                )}
              >
                <span className="text-white font-bold">M</span>
              </div>
              <span
                className={cn(
                  "font-bold text-xl",
                  isAdmin ? "text-white" : "text-primary-700",
                )}
              >
                MentorMe
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg"
            >
              <XMarkIcon
                className={cn(
                  "w-5 h-5",
                  isAdmin ? "text-red-200" : "text-gray-500",
                )}
              />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                    isActive ? linkActive : linkIdle,
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className={cn("border-t p-4", sidebarBorder)}>
            <p
              className={cn(
                "text-sm font-medium truncate",
                isAdmin ? "text-white" : "text-gray-900",
              )}
            >
              {user?.name}
            </p>
            <p
              className={cn(
                "text-xs truncate mb-3",
                isAdmin ? "text-red-300" : "text-gray-500",
              )}
            >
              {user?.email}
            </p>
            {!isAdmin && (
              <button
                onClick={() => navigate("/")}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
              >
                ← Back to Home
              </button>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-lg",
                isAdmin
                  ? "text-red-200 hover:bg-red-800"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <span className="text-sm text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
