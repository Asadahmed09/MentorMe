import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { requestAPI } from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  CalendarIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const statusVariant = (s: string): any =>
  ({
    pending: "warning",
    accepted: "success",
    rejected: "danger",
    completed: "primary",
  })[s] || "gray";

export default function DashboardPage() {
  const { user, mentorProfile } = useAuthStore();

  const { data: studentRequests, isLoading: loadingStudent } = useQuery({
    queryKey: ["requests-student"],
    queryFn: () => requestAPI.getAsStudent(),
    enabled: user?.role === "student",
  });

  const { data: mentorRequests, isLoading: loadingMentor } = useQuery({
    queryKey: ["requests-mentor"],
    queryFn: () => requestAPI.getAsMentor(),
    enabled: user?.role === "mentor",
  });

  const requests =
    user?.role === "mentor"
      ? mentorRequests?.requests || []
      : studentRequests?.requests || [];

  const isLoading = user?.role === "mentor" ? loadingMentor : loadingStudent;
  const pending = requests.filter((r: any) => r.status === "pending").length;
  const accepted = requests.filter((r: any) => r.status === "accepted").length;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="mt-2 text-white/80">
          {user?.role === "mentor"
            ? "Manage your mentorship requests and connect with students."
            : "Track your requests and connect with mentors."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-100">
              <CalendarIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-100">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{accepted}</p>
              <p className="text-sm text-gray-500">Accepted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-yellow-100">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(Number(mentorProfile?.average_rating) || 0).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-100">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {requests.length}
              </p>
              <p className="text-sm text-gray-500">Total Requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Requests
            </h2>
            <Link to="/dashboard/sessions">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                View All
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No requests yet</p>
                <Link to="/mentors">
                  <Button size="sm" className="mt-4">
                    Find a Mentor
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((r: any) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.role === "mentor"
                          ? r.student_name
                          : r.mentor_name}
                      </p>
                      <p className="text-sm text-gray-500">{r.subject_name}</p>
                    </div>
                    <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/dashboard/browse-mentors" className="block">
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                <div className="p-3 rounded-xl bg-primary-600">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find a Mentor</p>
                  <p className="text-sm text-gray-500">
                    Browse and connect with expert mentors
                  </p>
                </div>
              </div>
            </Link>

            {user?.role === "student" && !mentorProfile && (
              <Link to="/dashboard/become-mentor" className="block">
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="p-3 rounded-xl bg-purple-600">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Become a Mentor</p>
                    <p className="text-sm text-gray-500">
                      Share your expertise and help others
                    </p>
                  </div>
                </div>
              </Link>
            )}

            <Link to="/dashboard/sessions" className="block">
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                <div className="p-3 rounded-xl bg-orange-600">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">My Requests</p>
                  <p className="text-sm text-gray-500">
                    View and manage your mentorship requests
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
