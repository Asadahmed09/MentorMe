export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  mentorStatus?: "pending" | "approved" | "rejected" | null;
  univeristy: string;
  profile_image?: string;
  phone?: string;
  whatsapp_number?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  created_at: string;
}

export interface MentorProfile {
  id: number;
  user_id: number;
  gpa: number;
  bio?: string;
  experience?: string;
  status: "pending" | "approved" | "rejected";
  is_verified: boolean;
  verified_at?: string;
  phone?: string;
  show_email: boolean;
  show_phone: boolean;
  contact_visibility: "public" | "accepted_only" | "none";
  average_rating: number;
  total_ratings: number;
  created_at: string;
}

export interface Mentor {
  id: number;
  name: string;
  email: string;
  univeristy: string;
  profile_image?: string;
  mentor_profile_id: number;
  gpa: number;
  bio?: string;
  experience?: string;
  phone?: string;
  show_email?: boolean;
  show_phone?: boolean;
  contact_visibility?: "public" | "accepted_only" | "none";
  average_rating: number;
  total_ratings: number;
  status: string;
  subjects: string[];
  subject_details?: { id: number; name: string }[];
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
  category: string;
}

export interface MentorshipRequest {
  id: number;
  mentor_id?: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
  mentor_name?: string;
  mentor_email?: string;
  mentor_image?: string;
  mentor_phone?: string;
  mentor_whatsapp?: string;
  mentor_linkedin?: string;
  mentor_github?: string;
  mentor_website?: string;
  show_email?: boolean;
  show_phone?: boolean;
  contact_visibility?: "public" | "accepted_only" | "none";
  student_name?: string;
  student_email?: string;
  subject_name?: string;
}

export interface Rating {
  id: number;
  score: number;
  review?: string;
  created_at: string;
}

export interface AdminStats {
  total_users: string;
  approved_mentors: string;
  pending_applications: string;
  total_requests: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
