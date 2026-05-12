const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res: Response) => {
  // Some responses (304 Not Modified, 204 No Content) may have empty bodies.
  // Attempt to parse JSON only when there's a body, otherwise return an empty object.
  if (res.status === 304 || res.status === 204) {
    if (!res.ok) return {}; // treat not-modified/no-content as empty payload
  }

  let data: any = {};
  try {
    // Guard against empty response body which would throw when parsing
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    // If parsing fails, return empty object or include raw text
    data = {};
  }

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ─── Auth ───────────────────────────────────────────
export const authAPI = {
  register: (data: any) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  login: (email: string, password: string) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  adminLogin: (adminId: string, password: string) =>
    fetch(`${BASE_URL}/auth/admin-login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ admin_id: adminId, password }),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: headers(),
    }).then(handleResponse),

  updateMe: (data: any) =>
    fetch(`${BASE_URL}/auth/me`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ─── Mentors ─────────────────────────────────────────
export const mentorAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/mentors`, { headers: headers() }).then(handleResponse),

  getById: (id: number) =>
    fetch(`${BASE_URL}/mentors/${id}`, { headers: headers() }).then(
      handleResponse,
    ),

  getSubjects: () =>
    fetch(`${BASE_URL}/mentors/subjects`, { headers: headers() }).then(
      handleResponse,
    ),

  apply: (data: any) =>
    fetch(`${BASE_URL}/mentors/apply`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMentorStatus: () =>
    fetch(`${BASE_URL}/mentors/my-status`, { headers: headers() }).then(
      handleResponse,
    ),

  getMySubjects: () =>
    fetch(`${BASE_URL}/mentors/my-subjects`, { headers: headers() }).then(
      handleResponse,
    ),

  addSubject: (subject_id: number) =>
    fetch(`${BASE_URL}/mentors/my-subjects`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ subject_id }),
    }).then(handleResponse),
};

// ─── Requests ─────────────────────────────────────────
export const requestAPI = {
  create: (data: any) =>
    fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getAsStudent: () =>
    fetch(`${BASE_URL}/requests/student`, { headers: headers() }).then(
      handleResponse,
    ),

  getAsMentor: () =>
    fetch(`${BASE_URL}/requests/mentor`, { headers: headers() }).then(
      handleResponse,
    ),

  updateStatus: (id: number, status: string) =>
    fetch(`${BASE_URL}/requests/${id}/status`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  submitRating: (data: any) =>
    fetch(`${BASE_URL}/requests/ratings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getRatings: (mentor_id: number) =>
    fetch(`${BASE_URL}/requests/ratings/${mentor_id}`, {
      headers: headers(),
    }).then(handleResponse),
};

// ─── Admin ─────────────────────────────────────────
export const adminAPI = {
  getStats: () =>
    fetch(`${BASE_URL}/admin/stats`, { headers: headers() }).then(
      handleResponse,
    ),

  getPendingMentors: () =>
    fetch(`${BASE_URL}/admin/mentors/pending`, { headers: headers() }).then(
      handleResponse,
    ),

  approveMentor: (id: number, notes?: string) =>
    fetch(`${BASE_URL}/admin/mentors/${id}/approve`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ notes }),
    }).then(handleResponse),

  rejectMentor: (id: number, notes?: string) =>
    fetch(`${BASE_URL}/admin/mentors/${id}/reject`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ notes }),
    }).then(handleResponse),
};

// ─── Notifications ──────────────────────────────────
export const notificationAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/notifications`, { headers: headers() }).then(
      handleResponse,
    ),
  markRead: (id: number) =>
    fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: headers(),
    }).then(handleResponse),
};

// ─── Reports ────────────────────────────────────────
export const reportAPI = {
  submit: (data: { mentor_id: number; reason: string; details: string }) =>
    fetch(`${BASE_URL}/reports`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  getAll: () =>
    fetch(`${BASE_URL}/admin/reports`, { headers: headers() }).then(
      handleResponse,
    ),
};
