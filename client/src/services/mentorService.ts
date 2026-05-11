import { mentorAPI } from "./api";
import { Mentor, MentorProfile, PaginationMeta } from "../types";

interface GetMentorsParams {
  page?: number;
  limit?: number;
  subject?: string;
  minGPA?: number;
  sortBy?: string;
  search?: string;
}

interface MentorResponse {
  data: Mentor[];
  pagination: PaginationMeta;
}

const extractMentors = (payload: any): Mentor[] => {
  if (Array.isArray(payload)) return payload as Mentor[];
  if (Array.isArray(payload?.mentors)) return payload.mentors as Mentor[];
  if (Array.isArray(payload?.data)) return payload.data as Mentor[];
  return [];
};

const buildPagination = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const pages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

export const mentorService = {
  getMentors: async (params: GetMentorsParams): Promise<MentorResponse> => {
    const response = await mentorAPI.getAll();
    let filtered = extractMentors(response);

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.bio?.toLowerCase().includes(q),
      );
    }

    if (params.subject) {
      const subject = params.subject.toLowerCase();
      filtered = filtered.filter((m) =>
        m.subjects?.some((s) => s.toLowerCase() === subject),
      );
    }

    if (params.minGPA !== undefined) {
      filtered = filtered.filter((m) => m.gpa >= params.minGPA!);
    }

    if (params.sortBy === "gpa") {
      filtered.sort((a, b) => b.gpa - a.gpa);
    } else if (params.sortBy === "sessions") {
      filtered.sort((a, b) => b.total_ratings - a.total_ratings);
    } else {
      filtered.sort((a, b) => b.average_rating - a.average_rating);
    }

    const page = params.page || 1;
    const limit = params.limit || 12;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      data: paged,
      pagination: buildPagination(filtered.length, page, limit),
    };
  },

  getMentorById: async (id: number): Promise<Mentor> => {
    const response = await mentorAPI.getById(id);
    const mentor = response?.mentor as Mentor | undefined;
    if (!mentor) throw new Error("Mentor not found");
    return mentor;
  },

  getTopMentors: async (limit = 6): Promise<Mentor[]> => {
    const response = await mentorAPI.getAll();
    return extractMentors(response)
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, limit);
  },

  createMentorProfile: async (data: any): Promise<MentorProfile> => {
    const response = await mentorAPI.apply(data);
    return response.mentorProfile as MentorProfile;
  },

  updateMentorProfile: async (_data: any): Promise<MentorProfile> => {
    return Promise.reject(new Error("Not implemented"));
  },

  getMentorStats: async (): Promise<any> => {
    return { totalSessions: 12, totalHours: 18, averageRating: 4.5 };
  },

  getMyMentorProfile: async (): Promise<Mentor | null> => {
    return null;
  },
};
