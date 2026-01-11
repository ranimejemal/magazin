import React, { useEffect, useState } from 'react';
import { Search, Eye, Loader2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/backend/client';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { logError } from '@/lib/logger';

type Order = Tables<'orders'> & {
  order_items?: Tables<'order_items'>[];
};

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
const deliveryOptions = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'failed'] as const;

type OrderStatus = typeof statusOptions[number];
type DeliveryStatus = typeof deliveryOptions[number];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as OrderStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (err) {
      logError('AdminOrders.fetch', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status as OrderStatus })
        .eq('id', orderId);
      if (error) throw error;
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      logError('AdminOrders.updateStatus', err);
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, deliveryStatus: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ delivery_status: deliveryStatus as DeliveryStatus })
        .eq('id', orderId);
      if (error) throw error;
      toast.success('Delivery status updated');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, delivery_status: deliveryStatus as DeliveryStatus });
      }
    } catch (err) {
      logError('AdminOrders.updateDelivery', err);
      toast.error('Failed to update delivery status');
    } finally {
      setSaving(false);
    }
  };

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

  const getDeliveryColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and delivery</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Delivery</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30">
                      <td className="p-4 font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <p className="font-medium">Customer</p>
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="p-4 font-semibold">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                          disabled={saving}
                        >
                          <SelectTrigger className={`w-32 h-8 text-xs ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.delivery_status || 'pending'}
                          onValueChange={(value) => updateDeliveryStatus(order.id, value)}
                          disabled={saving}
                        >
                          <SelectTrigger className={`w-36 h-8 text-xs ${getDeliveryColor(order.delivery_status || 'pending')}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryOptions.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order ID</Label>
                  <p className="font-medium">#{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Date</Label>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5" />
                  <span className="font-semibold">Delivery Status</span>
                </div>
                <Select
                  value={selectedOrder.delivery_status || 'pending'}
                  onValueChange={(value) => updateDeliveryStatus(selectedOrder.id, value)}
                  disabled={saving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryOptions.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOrder.tracking_code && (
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Tracking: </span>
                    {selectedOrder.tracking_code}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div>
                <Label className="text-muted-foreground mb-2 block">Items</Label>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                {selectedOrder.delivery_fee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>${Number(selectedOrder.delivery_fee).toFixed(2)}</span>
                  </div>
                )}
                {selectedOrder.tax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${Number(selectedOrder.tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${Number(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
