export interface UpdateUserRequest {
  userName: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  roleId: number;
  isActive: boolean;
}