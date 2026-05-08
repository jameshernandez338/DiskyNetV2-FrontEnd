export interface RolePermissionItemRequest {
  menuId: number;
  actionId: number;
  isGranted: boolean;
}

export interface UpdateRolePermissionsRequest {
  permissions: RolePermissionItemRequest[];
}
