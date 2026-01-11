import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-hero text-primary-foreground">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
            <Mail className="h-8 w-8" />
          </div>
          
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Stay Fresh with Our Newsletter
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get exclusive deals, new product alerts, and delicious recipes delivered to your inbox every week.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/20">
              <CheckCircle className="h-6 w-6 text-golden" />
              <span className="font-medium">Thanks for subscribing! Check your inbox for a welcome gift.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
                required
              />
              <Button type="submit" variant="secondary" size="lg" className="shrink-0">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="text-sm text-primary-foreground/60 mt-4">
            No spam, unsubscribe at any time. By subscribing you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
