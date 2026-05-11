import { User } from "../types";
import { mockUser } from "../data/mockData";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university: string;
  department?: string;
  semester?: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

// MVP: All auth operations return mock user immediately
export const authService = {
  login: async (_data: LoginData): Promise<AuthResponse> => {
    return { user: mockUser, accessToken: "mock-token" };
  },

  register: async (_data: RegisterData): Promise<AuthResponse> => {
    return { user: mockUser, accessToken: "mock-token" };
  },

  logout: async (): Promise<void> => {},

  getMe: async (): Promise<{ user: User; mentorProfile: any }> => {
    return { user: mockUser, mentorProfile: null };
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    return { accessToken: "mock-token" };
  },

  changePassword: async (
    _currentPassword: string,
    _newPassword: string,
  ): Promise<void> => {},
};
