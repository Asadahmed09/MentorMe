import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { requestAPI } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import {
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/helpers";

const statusFilters = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

const statusVariant = (s: string): any =>
  ({
    pending: "warning",
    accepted: "success",
    rejected: "danger",
    completed: "primary",
  })[s] || "gray";

export default function SessionsPage() {
  const { user } = useAuthStore();
  const isMentor = user?.role === "mentor";
  const isStudent = user?.role === "student";
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const { data: studentData, isLoading: loadingStudent } = useQuery({
    queryKey: ["requests-student"],
    queryFn: () => requestAPI.getAsStudent(),
    enabled: isStudent,
  });

  const { data: mentorData, isLoading: loadingMentor } = useQuery({
    queryKey: ["requests-mentor"],
    queryFn: () => requestAPI.getAsMentor(),
    enabled: isMentor,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      requestAPI.updateStatus(id, status),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["requests-mentor"] });
      toast.success(`Request ${vars.status}!`);
      setShowModal(false);
      setSelectedRequest(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to update"),
  });

  const allRequests = isMentor
    ? mentorData?.requests || []
    : studentData?.requests || [];

  const isLoading = isMentor ? loadingMentor : loadingStudent;

  const pageTitle = isMentor ? "Manage Requests" : "My Sessions";
  const pageSubtitle = isMentor
    ? "Review and respond to incoming requests"
    : "Track your mentorship requests";

  const filtered = statusFilter
    ? allRequests.filter((r: any) => r.status === statusFilter)
    : allRequests;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-gray-600">{pageSubtitle}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors",
              statusFilter === f.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r: any) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
                  {(isMentor ? r.student_name : r.mentor_name)?.charAt(0) ||
                    "?"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {isMentor ? r.student_name : r.mentor_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Subject: {r.subject_name}
                  </p>
                  {r.message && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{r.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>

                  {!isMentor && r.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => {
                        setSelectedRequest(r);
                        setShowContactModal(true);
                      }}
                    >
                      View Contact
                    </Button>
                  )}
                </div>
                <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
              </div>

              {/* Mentor actions on pending requests */}
              {isMentor && r.status === "pending" && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      updateMutation.mutate({ id: r.id, status: "accepted" })
                    }
                    isLoading={updateMutation.isPending}
                    leftIcon={<CheckIcon className="w-4 h-4" />}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(r);
                      setShowModal(true);
                    }}
                    leftIcon={<XMarkIcon className="w-4 h-4" />}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Student Contact Details Modal */}
      {!isMentor && (
        <Modal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedRequest(null);
          }}
          title="Mentor Contact Details"
        >
          <div className="space-y-4">
            {selectedRequest?.status === "accepted" ? (
              <>
                {selectedRequest?.show_email && (
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <EnvelopeIcon className="w-5 h-5 mt-0.5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedRequest?.mentor_email}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest?.show_phone && (
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <PhoneIcon className="w-5 h-5 mt-0.5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        {selectedRequest?.mentor_phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedRequest?.show_email &&
                  !selectedRequest?.show_phone && (
                    <p className="text-sm text-gray-500">
                      This mentor has not shared contact details.
                    </p>
                  )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Contact details are available only after the request is
                accepted.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {isMentor && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          title="Reject Request"
        >
          <p className="text-gray-600">
            Are you sure you want to reject this request from{" "}
            <strong>{selectedRequest?.student_name}</strong>?
          </p>
          <div className="mt-6 flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                updateMutation.mutate({
                  id: selectedRequest.id,
                  status: "rejected",
                })
              }
              isLoading={updateMutation.isPending}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
