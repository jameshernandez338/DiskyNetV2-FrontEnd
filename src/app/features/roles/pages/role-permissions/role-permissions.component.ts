import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChevronDown, KeyRound, LucideAngularModule, Save } from 'lucide-angular';
import { finalize, map, take } from 'rxjs';

import { RolesService } from '@core/services/roles.service';
import { MenuPermissionResponse } from '../../models/role-permissions-management-response.model';
import { UpdateRolePermissionsRequest } from '../../models/update-role-permissions-request.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SnackbarService } from '@shared/services/snackbar.service';

interface MenuGroup {
  id: number;
  name: string;
  order: number;
  menus: MenuPermissionResponse[];
}

@Component({
  selector: 'app-role-permissions',
  imports: [RouterLink, LucideAngularModule, LoadingSpinnerComponent],
  templateUrl: './role-permissions.component.html'
})
export class RolePermissionsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly rolesService = inject(RolesService);
  private readonly snackbar = inject(SnackbarService);

  private readonly roleId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) }
  );

  readonly loading = signal(false);
  readonly roleName = signal<string>('Rol');
  readonly menus = signal<MenuPermissionResponse[]>([]);

  readonly expandedMenus = signal<Set<number>>(new Set());

  readonly menuGroups = computed<MenuGroup[]>(() => {
    const all = this.menus();
    const groupMap = new Map<number, MenuGroup>();

    for (const menu of all) {
      const groupId = menu.parentId ?? menu.menuId;
      const groupName = menu.parentName ?? menu.menuName;

      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, { id: groupId, name: groupName, order: 0, menus: [] });
      }
      groupMap.get(groupId)!.menus.push(menu);

      // Root menus use their own displayOrder; child menus use parentDisplayOrder
      if (menu.parentId === null) {
        groupMap.get(groupId)!.order = menu.displayOrder;
      } else if (menu.parentDisplayOrder != null) {
        groupMap.get(groupId)!.order = menu.parentDisplayOrder;
      }
    }

    return [...groupMap.values()]
      .map((g) => ({ ...g, menus: [...g.menus].sort((a, b) => a.displayOrder - b.displayOrder) }))
      .sort((a, b) => a.order - b.order);
  });

  // selectedActions: key = menuId, value = Set of actionIds
  readonly selectedActions = signal<Map<number, Set<number>>>(new Map());

  readonly icons = { KeyRound, Save, ChevronDown };

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const id = this.roleId();
    if (!id) return;

    this.loading.set(true);
    this.rolesService
      .getRolePermissions(id)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.roleName.set(data.roleName);
          this.menus.set(data.menuPermissions);

          // Expand all groups by default
          const groupIds = new Set(
            data.menuPermissions.map((m) => m.parentId ?? m.menuId)
          );
          this.expandedMenus.set(groupIds);

          // Initialize selections from isGranted
          const granted = new Map<number, Set<number>>();
          for (const menu of data.menuPermissions) {
            granted.set(
              menu.menuId,
              new Set(menu.actions.filter((a) => a.isGranted).map((a) => a.actionId))
            );
          }
          this.selectedActions.set(granted);
        },
        error: () => this.snackbar.error('Error al cargar los permisos.')
      });
  }

  isExpanded(menuId: number): boolean {
    return this.expandedMenus().has(menuId);
  }

  toggleGroup(menuId: number): void {
    const set = new Set(this.expandedMenus());
    set.has(menuId) ? set.delete(menuId) : set.add(menuId);
    this.expandedMenus.set(set);
  }

  isActionSelected(menuId: number, actionId: number): boolean {
    return this.selectedActions().get(menuId)?.has(actionId) ?? false;
  }

  toggleAction(menuId: number, actionId: number, checked: boolean): void {
    const map = new Map(this.selectedActions());
    const set = new Set(map.get(menuId) ?? []);
    checked ? set.add(actionId) : set.delete(actionId);
    map.set(menuId, set);
    this.selectedActions.set(map);
  }

  save(): void {
    const id = this.roleId();
    if (!id) return;

    const permissions: UpdateRolePermissionsRequest['permissions'] = [];
    for (const menu of this.menus()) {
      const granted = this.selectedActions().get(menu.menuId) ?? new Set<number>();
      for (const action of menu.actions) {
        permissions.push({
          menuId: menu.menuId,
          actionId: action.actionId,
          isGranted: granted.has(action.actionId)
        });
      }
    }

    this.loading.set(true);
    this.rolesService
      .updateRolePermissions(id, { permissions })
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => this.snackbar.success('Permisos guardados correctamente.'),
        error: () => this.snackbar.error('Error al guardar los permisos.')
      });
  }
}


