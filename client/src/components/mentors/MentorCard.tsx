import { Link } from "react-router-dom";
import { Mentor } from "../../types";
import Button from "../ui/Button";
import { AcademicCapIcon, StarIcon } from "@heroicons/react/24/outline";

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
          {mentor.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
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
          {mentor.average_rating > 0 ? mentor.average_rating.toFixed(1) : "New"}
        </span>
      </div>

      {mentor.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>
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
  );
}
