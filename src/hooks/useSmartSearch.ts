import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/backend/client';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface SmartSearchResult {
  suggestions: string[];
  enhancedQuery: string;
  relatedCategories: string[];
}

export function useSmartSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch products matching query
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_active', true)
          .limit(12);

        if (!error && products) {
          setResults(products);

          // Get AI-powered suggestions
          try {
            const { data: aiData, error: aiError } = await supabase.functions.invoke('smart-search', {
              body: { query, products },
            });

            if (!aiError && aiData) {
              setSuggestions(aiData.suggestions || []);
            }
          } catch {
            // AI suggestions are optional, continue without them
            setSuggestions([]);
          }
        }
      } catch (err) {
        console.error('Smart search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, suggestions, loading };
}
