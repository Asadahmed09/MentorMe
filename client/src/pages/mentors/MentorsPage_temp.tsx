import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mentorAPI } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { Mentor, Subject } from "../../types";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function MentorsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => mentorAPI.getSubjects(),
  });

  const { data: mentorsData, isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: () => mentorAPI.getAll(),
  });

  const subjects: Subject[] = subjectsData?.subjects || [];
  const allMentors: Mentor[] = mentorsData?.mentors || [];

  const filtered = allMentors.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject
      ? m.subjects?.includes(selectedSubject)
      : true;
    return matchSearch && matchSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Find Your Perfect Mentor
          </h1>
          <p className="mt-2 text-gray-600">
            Browse our verified mentors and find the one that matches your needs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search mentors by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          {(search || selectedSubject) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setSelectedSubject("");
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{mentor.univeristy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <AcademicCapIcon className="w-4 h-4" />
                    GPA: {mentor.gpa}
                  </span>
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    {mentor.average_rating > 0
                      ? mentor.average_rating.toFixed(1)
                      : "New"}
                  </span>
                </div>

                {mentor.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {mentor.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.subjects
                    ?.filter(Boolean)
                    .slice(0, 3)
                    .map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                </div>

                <Link
                  to={
                    user
                      ? `/dashboard/mentor/${mentor.id}`
                      : `/mentors/${mentor.id}`
                  }
                >
                  <Button className="w-full" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
