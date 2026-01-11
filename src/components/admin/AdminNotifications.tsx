import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/backend/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface OrderNotification {
  id: string;
  total: number;
  created_at: string;
  status: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch recent orders on mount
    const fetchRecentOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('id, total, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setNotifications(data);
      }
    };

    fetchRecentOrders();

    // Subscribe to realtime order inserts
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new as OrderNotification;
          
          setNotifications((prev) => [newOrder, ...prev.slice(0, 4)]);
          setUnreadCount((prev) => prev + 1);
          
          // Show toast notification
          toast({
            title: '🛒 New Order!',
            description: `Order #${newOrder.id.slice(0, 8)} - $${Number(newOrder.total).toFixed(2)}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleOpenDropdown = () => {
    setUnreadCount(0);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpenDropdown()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2 border-b">
          <p className="font-semibold">Notifications</p>
        </div>
        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notifications.map((order) => (
            <DropdownMenuItem key={order.id} asChild>
              <Link
                to={`/admin/orders`}
                className="flex items-start gap-3 px-3 py-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  🛒
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">New Order</p>
                  <p className="text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)} • ${Number(order.total).toFixed(2)}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatTime(order.created_at)}
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <div className="border-t px-3 py-2">
          <Link
            to="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            View all orders →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotifications;
