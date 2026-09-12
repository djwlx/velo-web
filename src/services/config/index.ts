import { request } from '@/utils/request';

export interface AppVersion {
  server: string;
  web: string | null;
}

export const getVersion = () => request<AppVersion>('/config/version');
