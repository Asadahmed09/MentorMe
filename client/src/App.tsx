import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MentorsPage from "./pages/mentors/MentorsPage";
import MentorDetailPage from "./pages/mentors/MentorDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionsPage from "./pages/dashboard/SessionsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import BecomeMentorPage from "./pages/dashboard/BecomeMentorPage";
import AddSubjectPage from "./pages/dashboard/AddSubjectPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/mentors/:id" element={<MentorDetailPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sessions"
          element={
            <ProtectedRoute>
              <SessionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/become-mentor"
          element={
            <ProtectedRoute>
              <BecomeMentorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subjects"
          element={
            <ProtectedRoute>
              <AddSubjectPage />
            </ProtectedRoute>
          }
        />
        {/* Browse Mentors with sidebar for authenticated users */}
        <Route
          path="/dashboard/browse-mentors"
          element={
            <ProtectedRoute>
              <MentorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/mentor/:id"
          element={
            <ProtectedRoute>
              <MentorDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
