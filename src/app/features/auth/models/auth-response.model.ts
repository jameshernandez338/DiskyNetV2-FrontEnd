import { Permission } from '@core/models/permission.model';

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token: string;
  fullName: string;
  permissions: Permission[];
}