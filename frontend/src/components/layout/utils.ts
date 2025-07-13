export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { to: '/trades', label: 'Trades', icon: '📊' },
  { to: '/estadisticas', label: 'Estadísticas', icon: '📈' },
  { to: '/dashboard', label: 'Dashboard', icon: '🎯' },
]; 