export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand: string;
  inStock: boolean;
  stockCount?: number;
  unit: string;
  rating: number;
  reviewCount: number;
  badges?: ('sale' | 'new' | 'bestseller' | 'organic' | 'local')[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  code?: string;
  validUntil: string;
  bgColor: string;
}
