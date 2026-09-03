import { request } from '@/utils/request';
import type { UserInfo } from './types';

export const getUserInfo = () => {
  return request<UserInfo>('/user/info');
};
