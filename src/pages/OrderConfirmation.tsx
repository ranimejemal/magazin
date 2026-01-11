import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const OrderConfirmation: React.FC = () => {
  const orderNumber = `FM${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container-wide max-w-2xl text-center">
          <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-card">
            <div className="w-20 h-20 rounded-full bg-fresh-light flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Thank you for your order. We've received your payment and will start preparing your items.
            </p>

            <div className="bg-muted rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-display text-2xl font-bold text-primary">{orderNumber}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-fresh-light">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Preparing</p>
                <p className="text-xs text-muted-foreground">We're packing your order</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <Package className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Shipping</p>
                <p className="text-xs text-muted-foreground">3-5 business days</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <Package className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email has been sent to your email address with your order details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/account/orders">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Order Details
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="fresh" className="w-full sm:w-auto">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
