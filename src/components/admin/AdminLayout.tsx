import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Settings,
  Truck,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminNotifications from './AdminNotifications';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Store</span>
            </NavLink>
            <AdminNotifications />
          </div>
          <h1 className="font-display font-bold text-xl mt-4">
            Fresh<span className="text-primary">Mart</span> Admin
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
