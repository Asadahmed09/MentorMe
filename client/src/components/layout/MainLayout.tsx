import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl text-primary-700">
                MentorMe
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/mentors"
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                Find Mentors
              </Link>
              {user && (
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {menuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/mentors"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Find Mentors
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-white">MentorMe</span>
          <div className="flex gap-6 text-sm">
            <Link to="/mentors" className="hover:text-white">
              Find Mentors
            </Link>
            <Link to="/dashboard/become-mentor" className="hover:text-white">
              Become a Mentor
            </Link>
          </div>
          <p className="text-sm">&copy; 2026 MentorMe</p>
        </div>
      </footer>
    </div>
  );
}
