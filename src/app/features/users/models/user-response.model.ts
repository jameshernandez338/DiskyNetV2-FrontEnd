export interface UserResponse {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  roleId: number;
  roleName: string;
}