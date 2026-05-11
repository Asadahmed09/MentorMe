import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, adminLogin } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", adminId: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isAdmin) {
      if (!form.adminId || !form.password) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      try {
        await adminLogin(form.adminId, form.password);
        toast.success("Welcome, Admin!");
        navigate("/admin");
      } catch (err: any) {
        toast.error(err.message || "Admin login failed");
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.email || !form.password) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      try {
        await login(form.email, form.password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } catch (err: any) {
        toast.error(err.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? "Sign in to admin dashboard"
              : "Sign in to your MentorMe account"}
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {
              setIsAdmin(false);
              setForm({ email: "", password: "", adminId: "" });
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              !isAdmin
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => {
              setIsAdmin(true);
              setForm({ email: "", password: "", adminId: "" });
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isAdmin
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        <div className="space-y-4">
          {isAdmin ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin ID
              </label>
              <input
                type="text"
                value={form.adminId}
                onChange={(e) => setForm({ ...form, adminId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your admin ID"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${
                isAdmin ? "focus:ring-red-500" : "focus:ring-primary-500"
              }`}
              placeholder="••••••••"
            />
          </div>

          <Button
            className={`w-full ${isAdmin ? "bg-red-600 hover:bg-red-700" : ""}`}
            onClick={handleSubmit}
            isLoading={loading}
          >
            {isAdmin ? "Admin Sign In" : "Sign In"}
          </Button>
        </div>

        {!isAdmin && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
