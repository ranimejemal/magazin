import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/backend/client';
import type { Tables } from '@/integrations/supabase/types';
import { logError } from '@/lib/logger';

type Product = Tables<'products'>;

export function useProductSearch(query: string, limit = 8) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_active', true)
          .limit(limit);

        if (!error && data) {
          setResults(data);
        }
      } catch (err) {
        logError('useProductSearch', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, limit]);

  return { results, loading };
}
