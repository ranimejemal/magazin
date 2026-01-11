import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface SearchDropdownProps {
  results: Product[];
  loading: boolean;
  query: string;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, loading, query, onClose }) => {
  if (!query || query.length < 2) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border max-h-96 overflow-auto z-50">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="p-3 border-b border-border">
            <span className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
          </div>
          <ul>
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                  onClick={onClose}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${Number(product.price).toFixed(2)}</p>
                    {product.original_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${Number(product.original_price).toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={`/products?search=${encodeURIComponent(query)}`}
            className="block p-3 text-center text-sm font-medium text-primary hover:bg-muted border-t border-border"
            onClick={onClose}
          >
            View all results →
          </Link>
        </>
      ) : (
        <div className="py-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
