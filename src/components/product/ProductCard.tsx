import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/product/${product.id}`} className="product-card flex gap-4 p-4">
        <div className="relative w-24 h-24 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {discount && (
            <span className="badge-sale absolute top-1 left-1">-{discount}%</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-golden text-golden" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              variant={inCart ? 'fresh' : 'outline'}
              size="icon-sm"
              onClick={handleAddToCart}
            >
              {inCart ? <ShoppingCart className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/product/${product.id}`} className="product-card group p-3">
        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
        <span className="font-display font-bold text-primary">${product.price.toFixed(2)}</span>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && <span className="badge-sale">-{discount}%</span>}
          {product.badges?.includes('new') && <span className="badge-new">New</span>}
          {product.badges?.includes('bestseller') && <span className="badge-bestseller">Bestseller</span>}
          {product.badges?.includes('organic') && (
            <span className="bg-fresh-light text-fresh font-semibold text-xs px-2 py-1 rounded-full">
              Organic
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon-sm"
            className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant={inCart ? 'fresh' : 'default'}
            size="sm"
            className="w-full shadow-lg"
            onClick={handleAddToCart}
          >
            {inCart ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                In Cart
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-golden text-golden" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock status */}
        {!product.inStock && (
          <p className="text-xs text-destructive mt-2">Out of Stock</p>
        )}
        {product.inStock && product.stockCount && product.stockCount < 10 && (
          <p className="text-xs text-accent mt-2">Only {product.stockCount} left!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
