import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mentorAPI, requestAPI } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import {
  AcademicCapIcon,
  StarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function MentorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [form, setForm] = useState({ subject_id: "", message: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["mentor", id],
    queryFn: () => mentorAPI.getById(Number(id)),
    enabled: !!id,
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => mentorAPI.getSubjects(),
  });

  // Get student's requests to check for accepted request
  const { data: requestsData } = useQuery({
    queryKey: ["requests-student"],
    queryFn: () => requestAPI.getAsStudent(),
    enabled: user?.role === "student",
  });

  const pendingRequestExists = requestsData?.requests?.some(
    (r: any) =>
      r.mentor_id === mentor?.mentor_profile_id && r.status === "pending",
  );

  const requestMutation = useMutation({
    mutationFn: () =>
      requestAPI.create({
        mentor_id: mentor.mentor_profile_id,
        subject_id: Number(form.subject_id),
        message: form.message,
      }),
    onSuccess: () => {
      toast.success("Mentorship request sent!");
      setShowRequestModal(false);
      setForm({ subject_id: "", message: "" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send request");
    },
  });

  const handleSendRequest = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }
    if (!form.subject_id) {
      toast.error("Please select a subject");
      return;
    }
    requestMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Mentor not found</h2>
          <Button onClick={() => navigate("/mentors")} className="mt-4">
            Back to Mentors
          </Button>
        </div>
      </div>
    );
  }

  const mentor = data.mentor;
  const allSubjects = subjectsData?.subjects || [];
  const mentorSubjects = mentor.subject_details?.length
    ? mentor.subject_details
    : allSubjects.filter((s: any) => mentor.subjects?.includes(s.name));

  // Check if there's an accepted request with this mentor
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl">
                {mentor.name.charAt(0)}
              </div>
              <div className="text-center sm:text-left text-white">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {mentor.name}
                  </h1>
                  <CheckBadgeIcon className="w-6 h-6 text-green-300" />
                </div>
                <p className="mt-1 text-white/80">{mentor.univeristy}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/80">
                    {mentor.average_rating > 0
                      ? mentor.average_rating.toFixed(1)
                      : "No ratings yet"}
                    {mentor.total_ratings > 0 &&
                      ` (${mentor.total_ratings} reviews)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <AcademicCapIcon className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{mentor.gpa}</p>
                <p className="text-sm text-gray-500">GPA</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <StarIcon className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">
                  {mentor.total_ratings}
                </p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
            </div>

            {/* Bio */}
            {mentor.bio && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About
                </h2>
                <p className="text-gray-600">{mentor.bio}</p>
              </div>
            )}

            {/* Experience */}
            {mentor.experience && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Experience
                </h2>
                <p className="text-gray-600">{mentor.experience}</p>
              </div>
            )}

            {/* Subjects */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {mentor.subjects
                  ?.filter(Boolean)
                  .map((s: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action */}
            {user?.role === "student" && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setShowRequestModal(true)}
                disabled={pendingRequestExists}
              >
                {pendingRequestExists
                  ? "Request Pending"
                  : "Send Mentorship Request"}
              </Button>
            )}
            {!isAuthenticated && (
              <p className="text-center text-gray-500 mt-4">
                <a href="/login" className="text-primary-600 font-medium">
                  Login
                </a>{" "}
                to send a request
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Send Mentorship Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              value={form.subject_id}
              onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a subject</option>
              {mentorSubjects.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
              placeholder="Introduce yourself and explain what you need help with..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowRequestModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              isLoading={requestMutation.isPending}
              className="flex-1"
            >
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
