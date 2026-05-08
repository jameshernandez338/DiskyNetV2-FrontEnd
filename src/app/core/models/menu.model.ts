export interface MenuItem {
  id: number;
  code: string | null;
  menuName: string;
  menuRoute: string | null;
  icon: string | null;
  displayOrder: number;
  parentId: number | null;
  menuType: 'group' | 'link' | string;
}

export interface MenuNode extends MenuItem {
  children: MenuNode[];
}