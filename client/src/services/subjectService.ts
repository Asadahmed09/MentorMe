import { Subject, PaginationMeta } from "../types";
import { mentorAPI } from "./api";

interface GetSubjectsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

const extractSubjects = (payload: any): Subject[] => {
  if (Array.isArray(payload)) return payload as Subject[];
  if (Array.isArray(payload?.data)) return payload.data as Subject[];
  if (Array.isArray(payload?.subjects)) return payload.subjects as Subject[];
  return [];
};

export const subjectService = {
  getSubjects: async (
    params: GetSubjectsParams = {},
  ): Promise<{ data: Subject[]; pagination: PaginationMeta }> => {
    const response = await mentorAPI.getSubjects();
    let filtered = extractSubjects(response);

    if (params.category) {
      filtered = filtered.filter((s) => s.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 100;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      data: paged,
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
        hasNext: start + limit < filtered.length,
        hasPrev: page > 1,
      },
    };
  },

  getSubjectById: async (id: number): Promise<Subject> => {
    const response = await mentorAPI.getSubjects();
    const subjects = extractSubjects(response);
    const subject = subjects.find((s) => s.id === id);
    if (!subject) throw new Error("Subject not found");
    return subject;
  },

  getDepartments: async (): Promise<string[]> => {
    const response = await mentorAPI.getSubjects();
    const subjects = extractSubjects(response);
    return [...new Set(subjects.map((s) => s.category))];
  },
};
