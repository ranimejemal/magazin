import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Features bar */}
      <div className="border-b border-background/10">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Free Delivery</h4>
                <p className="text-sm text-background/60">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Secure Payment</h4>
                <p className="text-sm text-background/60">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Easy Returns</h4>
                <p className="text-sm text-background/60">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-background/60">Here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">F</span>
              </div>
              <span className="font-display font-bold text-2xl">
                Fresh<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-background/60 mb-6 max-w-sm">
              Your trusted neighborhood grocery store, delivering freshness and quality to your doorstep since 2015.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40"
                />
                <Button variant="fresh">Subscribe</Button>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Beverages', 'Pantry', 'Frozen Foods'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-background/60 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Store Locator', 'Blog', 'Press', 'Sustainability'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-background/60 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {['FAQs', 'Delivery Info', 'Returns & Refunds', 'Track Order', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-background/60 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-background/60">
                <Phone className="h-4 w-4" />
                <span>1-800-FRESH</span>
              </div>
              <div className="flex items-center gap-2 text-background/60">
                <Mail className="h-4 w-4" />
                <span>help@freshmart.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © 2024 FreshMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
