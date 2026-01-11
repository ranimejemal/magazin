import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

const CartSidebar: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const deliveryFee = cartTotal >= 50 ? 0 : 5.99;
  const finalTotal = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Start adding some fresh groceries!</p>
          <SheetClose asChild>
            <Button variant="fresh" size="lg" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-6 border-b border-border">
        <SheetTitle className="font-display text-xl">
          Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </SheetTitle>
      </SheetHeader>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-4 p-3 rounded-xl bg-muted/50"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{item.product.unit}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-semibold text-primary">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeFromCart(item.product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-border p-6 space-y-4 bg-card">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          {deliveryFee > 0 && (
            <p className="text-xs text-muted-foreground">
              Add ${(50 - cartTotal).toFixed(2)} more for free delivery
            </p>
          )}
        </div>
        <div className="flex justify-between font-display font-semibold text-lg pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">${finalTotal.toFixed(2)}</span>
        </div>
        <SheetClose asChild>
          <Button variant="fresh" size="lg" className="w-full" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/cart">View Full Cart</Link>
          </Button>
        </SheetClose>
      </div>
    </div>
  );
};

export default CartSidebar;
