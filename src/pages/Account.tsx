import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/backend/client';
import { Badge } from '@/components/ui/badge';

// Orders Tab Component with delivery tracking
const OrdersTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'out_for_delivery': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-muted text-muted-foreground';
  };

  const formatDeliveryStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-bold mb-6">Order History</h2>
        <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-bold mb-6">Order History</h2>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
          <Link to="/products">
            <Button variant="fresh">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold">Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
          </div>

          {/* Delivery Tracking */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              {getDeliveryStatusIcon(order.delivery_status || 'pending')}
              <div>
                <p className="font-medium">Delivery Status</p>
                <p className="text-sm text-muted-foreground">
                  {formatDeliveryStatus(order.delivery_status || 'pending')}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-4">
              {['pending', 'preparing', 'out_for_delivery', 'delivered'].map((step, idx) => {
                const currentIdx = ['pending', 'preparing', 'out_for_delivery', 'delivered'].indexOf(order.delivery_status || 'pending');
                const isCompleted = idx <= currentIdx;
                const isFailed = order.delivery_status === 'failed';
                
                return (
                  <React.Fragment key={step}>
                    <div className={`h-2 flex-1 rounded-full ${isFailed ? 'bg-red-200' : isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Pending</span>
              <span>Preparing</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>

            {order.tracking_code && (
              <p className="text-sm mt-3">
                <span className="text-muted-foreground">Tracking: </span>
                <span className="font-mono">{order.tracking_code}</span>
              </p>
            )}
            {order.estimated_delivery && (
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Estimated: </span>
                {new Date(order.estimated_delivery).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${Number(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Account: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Sign in to view your account</h1>
            <p className="text-muted-foreground mb-6">Access your orders, favorites, and settings</p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button variant="fresh">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="border-b border-border">
          <div className="container-wide py-4">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">My Account</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-display font-bold text-xl">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Welcome back!</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-fresh-light text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </nav>

                <Button
                  variant="ghost"
                  className="w-full mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-6">Profile Information</h2>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user.email || ''} disabled />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <Button type="submit" variant="fresh">Save Changes</Button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <OrdersTab userId={user.id} />
              )}

              {activeTab === 'favorites' && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-6">My Favorites</h2>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No favorites yet. Browse products and save your favorites!</p>
                    <Link to="/products">
                      <Button variant="fresh">Browse Products</Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold">Saved Addresses</h2>
                    <Button variant="outline">Add New Address</Button>
                  </div>
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No addresses saved yet</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive order updates and promotions</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Get delivery updates via text</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5" />
                    </div>
                    <Button variant="destructive" className="mt-4">
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
