import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mentorAPI } from "../services/api";
import { Mentor } from "../types";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  AcademicCapIcon,
  UserGroupIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: AcademicCapIcon,
    title: "Expert Mentors",
    description:
      "Connect with top-performing students who excel in your subjects",
  },
  {
    icon: UserGroupIcon,
    title: "Peer Learning",
    description: "Learn from peers who recently mastered the same challenges",
  },
  {
    icon: StarIcon,
    title: "Verified Excellence",
    description:
      "All mentors are verified with high GPAs and proven track records",
  },
];

const stats = [
  { label: "Active Mentors", value: "500+" },
  { label: "Sessions Completed", value: "10,000+" },
  { label: "Student Satisfaction", value: "98%" },
  { label: "Universities", value: "50+" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  // Show nothing while redirecting
  if (user) {
    return null;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["mentors-home"],
    queryFn: () => mentorAPI.getAll(),
  });

  const topMentors: Mentor[] = (data?.mentors || [])
    .sort((a: Mentor, b: Mentor) => b.average_rating - a.average_rating)
    .slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Perfect
              <span className="block text-yellow-300">Academic Mentor</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Connect with top-performing students who can help you excel in
              your studies. Get personalized guidance from peers who understand
              your challenges.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/mentors">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl"
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  Find a Mentor
                </Button>
              </Link>
              <Link to="/dashboard/become-mentor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Become a Mentor
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-primary-600">MentorMe</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find the right mentor and get the academic
              support you need.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Mentors Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Top Rated Mentors
              </h2>
              <p className="mt-2 text-gray-600">
                Learn from the best performers in your university
              </p>
            </div>
            <Link to="/mentors" className="hidden sm:block">
              <Button
                variant="outline"
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : topMentors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No mentors available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMentors.map((mentor) => (
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
                      <p className="text-sm text-gray-500">
                        {mentor.univeristy}
                      </p>
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

                  <Link to={`/mentors/${mentor.id}`}>
                    <Button className="w-full" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/mentors">
              <Button rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                View All Mentors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Your Mentor",
                description:
                  "Browse through our verified mentors and filter by subject, GPA, and ratings.",
              },
              {
                step: "02",
                title: "Send a Request",
                description:
                  "Send a mentorship request with your subject and a short message.",
              },
              {
                step: "03",
                title: "Learn & Grow",
                description:
                  "Connect with your mentor, learn, and improve your academic performance.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Excel in Your Studies?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of students who have improved their grades with
            MentorMe.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user && (
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
              </Link>
            )}
            <Link to="/mentors">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Browse Mentors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
