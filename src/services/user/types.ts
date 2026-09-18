export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface MeResponse {
  user: UserProfile;
  roles: string[];
  permissions: string[];
}
