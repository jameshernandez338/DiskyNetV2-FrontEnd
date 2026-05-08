import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import {
  BookImage,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumn,
  ChevronDown,
  ChevronRight,
  Circle,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Files,
  FileText,
  FileUser,
  House,
  LayoutDashboard,
  LucideAngularModule,
  Mail,
  Newspaper,
  Settings,
  ShieldCheck,
  ShieldUser,
  TreePalm,
  UserRound,
  UserRoundX,
  UsersRound,
  X
} from 'lucide-angular';

import { MenuItem, MenuNode } from '@core/models/menu.model';
import { AuthService } from '@core/services/auth.service';
import { MenuService } from '@core/services/menu.service';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

type NavigationIcon = typeof Circle;

@Component({
  selector: 'app-navigation',
  imports: [NgClass, RouterLink, RouterLinkActive, LucideAngularModule, TooltipDirective],
  templateUrl: './navigation.component.html',
  host: {
    class: 'lg:flex lg:shrink-0 lg:transition-[width] lg:duration-200 lg:ease-out'
  }
})
export class NavigationComponent {
  private readonly menuService = inject(MenuService);
  private readonly authService = inject(AuthService);
  private readonly expandedGroups: Record<number, boolean> = {};

  @Input() isOpen = false;
  @Input() isCollapsed = false;
  @Output() navigationClose = new EventEmitter<void>();

  readonly menus = toSignal(
    this.menuService.getMyMenus().pipe(
      map((menus) => this.filterMenuTree(this.buildMenuTree(menus))),
      catchError(() => of([]))
    ),
    { initialValue: [] }
  );

  @HostBinding('class.lg:w-20')
  get collapsedWidth() {
    return this.isCollapsed;
  }

  @HostBinding('class.lg:w-64')
  get expandedWidth() {
    return !this.isCollapsed;
  }

  icons = {
    ChevronDown,
    ChevronRight,
    House,
    ShieldCheck,
    X
  };

  private readonly iconMap: Record<string, NavigationIcon> = {
    bookimage: BookImage,
    briefcasebusiness: BriefcaseBusiness,
    calendar: CalendarDays,
    calendardays: CalendarDays,
    chart: ChartNoAxesColumn,
    chartnoaxescolumn: ChartNoAxesColumn,
    clipboard: Clipboard,
    clipboardcheck: ClipboardCheck,
    clipboardlist: ClipboardList,
    dashboard: LayoutDashboard,
    files: Files,
    filetext: FileText,
    fileuser: FileUser,
    home: House,
    layoutdashboard: LayoutDashboard,
    mail: Mail,
    newspaper: Newspaper,
    settings: Settings,
    shield: ShieldCheck,
    shieldcheck: ShieldCheck,
    shielduser: ShieldUser,
    treepalm: TreePalm,
    user: UserRound,
    userround: UserRound,
    userroundx: UserRoundX,
    users: UsersRound,
    usersround: UsersRound
  };

  getIcon(iconName: string | null): NavigationIcon {
    if (!iconName) {
      return Circle;
    }

    return this.iconMap[this.normalizeIconName(iconName)] ?? Circle;
  }

  isLink(menu: MenuNode): boolean {
    return menu.menuType.toLowerCase() === 'link' && !!menu.menuRoute;
  }

  trackByMenuId(_index: number, menu: MenuNode): number {
    return menu.id;
  }

  isGroupExpanded(menu: MenuNode): boolean {
    return this.expandedGroups[menu.id] ?? true;
  }

  toggleGroup(menu: MenuNode): void {
    const shouldExpand = !this.isGroupExpanded(menu);

    for (const groupId of Object.keys(this.expandedGroups)) {
      this.expandedGroups[Number(groupId)] = false;
    }

    this.expandedGroups[menu.id] = shouldExpand;
  }

  private buildMenuTree(menus: MenuItem[]): MenuNode[] {
    const nodes: MenuNode[] = menus
      .map((menu) => ({ ...menu, children: [] as MenuNode[] }))
      .sort((left, right) => left.displayOrder - right.displayOrder);
    const nodesById = new Map<number, MenuNode>();
    const roots: MenuNode[] = [];

    for (const node of nodes) {
      nodesById.set(node.id, node);
    }

    for (const node of nodes) {
      const parent = node.parentId ? nodesById.get(node.parentId) : null;

      if (parent) {
        parent.children.push(node);
        continue;
      }

      roots.push(node);
    }

    for (const node of nodes) {
      if (node.children.length > 0 && this.expandedGroups[node.id] === undefined) {
        this.expandedGroups[node.id] = false;
      }
    }

    return roots;
  }

  private filterMenuTree(nodes: MenuNode[]): MenuNode[] {
    const result: MenuNode[] = [];

    for (const node of nodes) {
      if (this.isLink(node)) {
        // Si no tiene menuCode no requiere permiso especial → siempre visible
        if (!node.code || this.authService.hasPermission(node.code, 'VIEW')) {
          result.push(node);
        }
      } else {
        // Grupo: solo se muestra si algún hijo es visible
        const visibleChildren = this.filterMenuTree(node.children);
        if (visibleChildren.length > 0) {
          result.push({ ...node, children: visibleChildren });
        }
      }
    }

    return result;
  }

  private normalizeIconName(iconName: string): string {
    return iconName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
}
