export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: string;
  bio?: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
