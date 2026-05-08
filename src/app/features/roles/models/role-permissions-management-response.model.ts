export interface ActionPermissionResponse {
  actionId: number;
  actionCode: string;
  actionDescription: string | null;
  isGranted: boolean;
}

export interface MenuPermissionResponse {
  menuId: number;
  menuCode: string;
  menuName: string;
  displayOrder: number;
  parentId: number | null;
  parentName: string | null;
  parentDisplayOrder: number | null;
  actions: ActionPermissionResponse[];
}

export interface RolePermissionsManagementResponse {
  roleId: number;
  roleName: string;
  menuPermissions: MenuPermissionResponse[];
}
