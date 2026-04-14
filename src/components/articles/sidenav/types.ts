export interface SidenavItemProps {
  label: string;
  href?: string;
  items?: SidenavItemProps[];
}

export interface SidenavProps {
  data: SidenavItemProps[];
}
