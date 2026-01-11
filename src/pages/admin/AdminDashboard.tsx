import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, ShoppingCart, Users, TrendingUp, DollarSign, Truck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/backend/client';
import { logError } from '@/lib/logger';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes, pendingRes, lowStockRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id, total', { count: 'exact' }),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('products').select('id', { count: 'exact', head: true }).lt('stock_count', 10).eq('is_active', true),
        ]);

        const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

        setStats({
          totalProducts: productsRes.count || 0,
          totalCategories: categoriesRes.count || 0,
          totalOrders: ordersRes.count || 0,
          pendingOrders: pendingRes.count || 0,
          totalRevenue,
          lowStockProducts: lowStockRes.count || 0,
        });

        // Fetch recent orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*, profiles(full_name, email)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRecentOrders(orders || []);
      } catch (err) {
        logError('AdminDashboard.fetchStats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-primary', link: '/admin/products' },
    { title: 'Categories', value: stats.totalCategories, icon: FolderTree, color: 'text-blue-500', link: '/admin/categories' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-green-500', link: '/admin/orders' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Truck, color: 'text-orange-500', link: '/admin/orders?status=pending' },
    { title: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500', link: '/admin/analytics' },
    { title: 'Low Stock', value: stats.lowStockProducts, icon: AlertTriangle, color: 'text-red-500', link: '/admin/products?stock=low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{loading ? '...' : stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Orders</span>
            <Link to="/admin/orders" className="text-sm font-normal text-primary hover:underline">
              View all →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-4">Loading...</p>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.full_name || order.profiles?.email || 'Guest'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
