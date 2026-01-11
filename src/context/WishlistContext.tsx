import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/backend/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist on mount and when user changes
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setWishlistIds(data.map((f) => f.product_id));
      }
    };

    fetchWishlist();
  }, [user]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to add items to your wishlist.',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
      const inWishlist = wishlistIds.includes(productId);

      if (inWishlist) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (!error) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          toast({ title: 'Removed from wishlist' });
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (!error) {
          setWishlistIds((prev) => [...prev, productId]);
          toast({ title: 'Added to wishlist' });
        }
      }

      setLoading(false);
    },
    [user, wishlistIds, toast]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
