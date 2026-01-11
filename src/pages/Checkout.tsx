import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, Check, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/backend/client';
import { logError } from '@/lib/logger';

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = getCartTotal();
  const deliveryFee = deliveryOption === 'express' ? 9.99 : subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to checkout</p>
            <Link to="/products">
              <Button variant="fresh">Start Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !session) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to place an order.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);

    try {
      // Call secure server-side order creation
      const response = await supabase.functions.invoke('create-order', {
        body: {
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
          shippingInfo,
          deliveryOption,
        },
      });

      if (response.error || !response.data?.success) {
        throw new Error(response.data?.error || 'Failed to create order');
      }

      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your order. You will receive a confirmation email shortly.',
      });
      navigate('/order-confirmation');
    } catch (error) {
      logError('Checkout', error);
      toast({
        title: 'Order failed',
        description: 'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container-wide py-4">
            <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>
        </div>

        <div className="container-wide py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="hidden sm:inline font-medium">Shipping</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="hidden sm:inline font-medium">Payment</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  3
                </div>
                <span className="hidden sm:inline font-medium">Confirm</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-xl font-bold">Shipping Information</h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={shippingInfo.zip}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Label className="mb-3 block">Delivery Option</Label>
                      <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as 'standard' | 'express')}>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Standard Delivery</p>
                                <p className="text-sm text-muted-foreground">3-5 business days</p>
                              </div>
                              <span className="font-medium">{subtotal >= 50 ? 'FREE' : '$4.99'}</span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary mt-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Express Delivery</p>
                                <p className="text-sm text-muted-foreground">1-2 business days</p>
                              </div>
                              <span className="font-medium">$9.99</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" variant="fresh" className="w-full h-12 mt-6">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-xl font-bold">Payment Method</h2>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-medium">Credit/Debit Card</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" required />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" variant="fresh" className="flex-1" disabled={loading}>
                        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-32">
                <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-fresh-light rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Truck className="h-4 w-4" />
                    <span>Free delivery on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
