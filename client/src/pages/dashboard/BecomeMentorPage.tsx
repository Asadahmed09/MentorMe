import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { subjectService } from "../../services/subjectService";
import { mentorAPI } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface MentorForm {
  overallGPA: number;
  bio: string;
  experience?: string;
  phone?: string;
  expertise: {
    subject: string;
    subjectGPA: number;
    grade?: string;
  }[];
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BecomeMentorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects", "mentor-apply"],
    queryFn: () => subjectService.getSubjects({ limit: 100 }),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MentorForm>({
    defaultValues: {
      expertise: [{ subject: "", subjectGPA: 3.0, grade: "" }],
      availableSlots: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    },
  });

  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control,
    name: "expertise",
  });

  const {
    fields: slotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({
    control,
    name: "availableSlots",
  });

  const onSubmit = async (data: MentorForm) => {
    if (!isAuthenticated) {
      toast.error("Please login to apply as a mentor");
      navigate("/login");
      return;
    }

    const subjectIds = data.expertise
      .map((exp) => Number(exp.subject))
      .filter((id) => Number.isFinite(id));

    if (subjectIds.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    setIsSubmitting(true);
    try {
      await mentorAPI.apply({
        gpa: data.overallGPA,
        bio: data.bio,
        experience: data.experience || null,
        phone: data.phone || null,
        subject_ids: subjectIds,
      });
      toast.success("Application submitted! We will review it shortly.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSubjects) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="gradient-bg p-8 text-center text-white">
          <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 text-white/80" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Become a Mentor
          </h1>
          <p className="mt-2 text-white/80">
            Share your knowledge and help other students succeed
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step >= s
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`hidden sm:inline ${
                    step >= s ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {s === 1
                    ? "Basic Info"
                    : s === 2
                      ? "Expertise"
                      : "Availability"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <Input
                label="Overall GPA *"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.50"
                error={errors.overallGPA?.message}
                {...register("overallGPA", {
                  required: "GPA is required",
                  valueAsNumber: true,
                  min: { value: 3.0, message: "Minimum GPA of 3.0 required" },
                  max: { value: 4.0, message: "Maximum GPA is 4.0" },
                })}
              />

              <div>
                <label className="label">Bio *</label>
                <textarea
                  className="input min-h-[150px]"
                  placeholder="Tell students about yourself, your teaching style, and how you can help them succeed..."
                  {...register("bio", {
                    required: "Bio is required",
                    minLength: {
                      value: 50,
                      message: "Bio must be at least 50 characters",
                    },
                  })}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Experience"
                  placeholder="e.g., 2 years tutoring CS"
                  {...register("experience")}
                />
                <Input
                  label="Phone"
                  placeholder="0300-1234567"
                  {...register("phone")}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  {...register("github")}
                />
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/..."
                  {...register("linkedin")}
                />
                <Input
                  label="Portfolio URL"
                  placeholder="https://..."
                  {...register("portfolio")}
                />
              </div>
            </div>
          )}

          {/* Step 2: Expertise */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="label">Subject Expertise *</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      appendExpertise({
                        subject: "",
                        subjectGPA: 3.0,
                        grade: "",
                      })
                    }
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                  >
                    Add Subject
                  </Button>
                </div>

                <div className="space-y-4">
                  {expertiseFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <select
                          className="input"
                          {...register(`expertise.${index}.subject`, {
                            required: "Subject is required",
                          })}
                        >
                          <option value="">Select Subject</option>
                          {subjects?.data?.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.01"
                          min="3"
                          max="4"
                          placeholder="GPA"
                          className="input"
                          {...register(`expertise.${index}.subjectGPA`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="text"
                          placeholder="Grade"
                          className="input"
                          {...register(`expertise.${index}.grade`)}
                        />
                      </div>
                      {expertiseFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpertise(index)}
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="label">Available Time Slots</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      appendSlot({
                        day: "Monday",
                        startTime: "09:00",
                        endTime: "17:00",
                      })
                    }
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                  >
                    Add Slot
                  </Button>
                </div>

                <div className="space-y-4">
                  {slotFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 min-w-[120px]">
                        <select
                          className="input"
                          {...register(`availableSlots.${index}.day`)}
                        >
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-28">
                        <input
                          type="time"
                          className="input"
                          {...register(`availableSlots.${index}.startTime`)}
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="time"
                          className="input"
                          {...register(`availableSlots.${index}.endTime`)}
                        />
                      </div>
                      {slotFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSlot(index)}
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting}>
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
