import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mentorAPI } from "../../services/api";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function AddSubjectPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: mySubjectsData, isLoading: loadingMine } = useQuery({
    queryKey: ["my-subjects"],
    queryFn: () => mentorAPI.getMySubjects(),
  });

  const { data: allSubjectsData, isLoading: loadingAll } = useQuery({
    queryKey: ["all-subjects"],
    queryFn: () => mentorAPI.getSubjects(),
  });

  const mySubjects: any[] = mySubjectsData?.subjects || [];
  const allSubjects: any[] = allSubjectsData?.subjects || [];
  const mySubjectIds = new Set(mySubjects.map((s) => s.id));
  const available = allSubjects.filter((s) => !mySubjectIds.has(s.id));
  const slotsLeft = 5 - mySubjects.length;

  const addMutation = useMutation({
    mutationFn: (id: number) => mentorAPI.addSubject(id),
    onSuccess: () => {
      toast.success("Subject added!");
      setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: ["my-subjects"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to add subject"),
  });

  if (loadingMine || loadingAll) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
        <p className="text-gray-600">
          You can teach up to 5 subjects.{" "}
          <span className="font-medium text-primary-600">
            {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining.
          </span>
        </p>
      </div>

      {/* Current subjects */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Current Subjects</h2>
        {mySubjects.length === 0 ? (
          <p className="text-gray-400 text-sm">No subjects added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mySubjects.map((s) => (
              <span
                key={s.id}
                className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add new subject */}
      {slotsLeft > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Add a Subject</h2>
          {available.length === 0 ? (
            <p className="text-gray-400 text-sm">
              All available subjects added.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {available.map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setSelectedId(s.id === selectedId ? null : s.id)
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                      selectedId === s.id
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-700 hover:border-primary-300"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <Button
                disabled={!selectedId}
                isLoading={addMutation.isPending}
                onClick={() => selectedId && addMutation.mutate(selectedId)}
                leftIcon={<AcademicCapIcon className="w-4 h-4" />}
              >
                Add Selected Subject
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 font-medium">
            You have reached the maximum of 5 subjects.
          </p>
        </div>
      )}
    </div>
  );
}
