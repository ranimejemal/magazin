import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const cartTotal = getCartTotal();
  const deliveryFee = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button variant="fresh" size="lg" asChild>
              <Link to="/products">
                Start Shopping
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container-wide py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-card rounded-xl shadow-sm"
                >
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{item.product.unit}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <span className="font-display font-bold text-lg text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-sm sticky top-32">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Promo code" className="pl-10" />
                  </div>
                  <Button variant="outline">Apply</Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-accent">
                      Add ${(50 - cartTotal).toFixed(2)} more for free delivery!
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between font-display text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button variant="fresh" size="lg" className="w-full mt-6" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button variant="outline" className="w-full mt-3" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>

                {/* Trust indicators */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>🔒</span>
                    <span>Secure checkout</span>
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

export default CartPage;
