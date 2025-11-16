import { apiClient } from "./client";
import {
  SignupData,
  SignupResponse,
  LoginData,
  LoginResponse,
  User,
} from "@/types/auth";
import cookies from "js-cookie";
export const authApi = {
  // Sign up
  signup: async (data: SignupData): Promise<SignupResponse> => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    return apiClient.postFormData<SignupResponse>(
      "/api/users/signup/",
      formData
    );
  },

  // Login
  login: async (data: LoginData): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await apiClient.postFormData<LoginResponse>(
      "/api/auth/login/",
      formData
    );

    // Store tokens
    if (response.access) {
      cookies.set("access_token", response.access);
      cookies;
    }
    if (response.refresh) {
      cookies.set("refresh_token", response.refresh);
    }

    return response;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/api/users/me/");
  },

  // Update profile
  updateProfile: async (
    data: Partial<User>,
    profileImage?: File
  ): Promise<User> => {
    const formData = new FormData();

    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.address) formData.append("address", data.address);
    if (data.contact_number)
      formData.append("contact_number", data.contact_number);
    if (data.birthday) formData.append("birthday", data.birthday);
    if (data.bio) formData.append("bio", data.bio);
    if (profileImage) formData.append("profile_image", profileImage);

    return apiClient.postFormData<User>("/api/users/me/", formData);
  },

  // Change password
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ detail: string }> => {
    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("new_password", newPassword);

    return apiClient.postFormData<{ detail: string }>(
      "/api/users/change-password/",
      formData
    );
  },

  // Logout
  logout: () => {
    cookies.remove("access_token");
    cookies.remove("refresh_token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!cookies.get("access_token");
  },
};
