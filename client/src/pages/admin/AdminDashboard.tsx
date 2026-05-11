import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminAPI } from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { cn, formatDate } from "../../utils/helpers";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Tab = "overview" | "mentors";

const tabFromParams = (value: string | null): Tab =>
  value === "mentors" ? "mentors" : "overview";

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("mentors");
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextTab = tabFromParams(searchParams.get("tab"));
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [activeTab, searchParams]);

  const { data: pendingData, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-mentors"],
    queryFn: () => adminAPI.getPendingMentors(),
    enabled: activeTab === "mentors",
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      adminAPI.approveMentor(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-mentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Mentor approved!");
      setShowModal(false);
      setSelectedMentor(null);
      setNotes("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      adminAPI.rejectMentor(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-mentors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Application rejected");
      setShowModal(false);
      setSelectedMentor(null);
      setNotes("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to reject"),
  });

  const pendingList = pendingData?.applications || [];
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "overview") {
      setSearchParams({});
      return;
    }
    setSearchParams({ tab });
  };

  const tabs = [
    { id: "mentors", label: "Manage Mentors", icon: AcademicCapIcon },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage the MentorMe platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as Tab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pending Mentors */}
      {activeTab === "mentors" && (
        <div>
          {loadingPending ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : pendingList.length === 0 ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-500">
                No pending applications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((mentor: any) => (
                <div
                  key={mentor.mentor_profile_id}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                      {mentor.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-gray-500">{mentor.email}</p>
                      <p className="text-sm text-gray-500">
                        {mentor.univeristy}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium">
                          GPA: {mentor.gpa}
                        </span>
                        <span className="text-sm text-gray-400">
                          Applied: {formatDate(mentor.created_at)}
                        </span>
                      </div>
                      {mentor.subjects?.filter(Boolean).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.subjects
                            .filter(Boolean)
                            .map((s: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setShowModal(true);
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedMentor(null);
          setNotes("");
        }}
        title="Review Mentor Application"
        size="lg"
      >
        {selectedMentor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                {selectedMentor.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedMentor.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedMentor.univeristy}
                </p>
                <p className="text-sm font-medium">GPA: {selectedMentor.gpa}</p>
              </div>
            </div>

            {selectedMentor.bio && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-1">Bio</h4>
                <p className="text-gray-600 text-sm">{selectedMentor.bio}</p>
              </div>
            )}

            {selectedMentor.experience && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                <p className="text-gray-600 text-sm">
                  {selectedMentor.experience}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add notes for this decision..."
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="danger"
                onClick={() =>
                  rejectMutation.mutate({
                    id: selectedMentor.mentor_profile_id,
                    notes,
                  })
                }
                isLoading={rejectMutation.isPending}
                leftIcon={<XCircleIcon className="w-5 h-5" />}
                className="flex-1"
              >
                Reject
              </Button>
              <Button
                onClick={() =>
                  approveMutation.mutate({
                    id: selectedMentor.mentor_profile_id,
                    notes,
                  })
                }
                isLoading={approveMutation.isPending}
                leftIcon={<CheckCircleIcon className="w-5 h-5" />}
                className="flex-1"
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
