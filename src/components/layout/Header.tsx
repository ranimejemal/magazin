import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, MapPin, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { categories } from '@/data/products';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CartSidebar from './CartSidebar';
import SearchDropdown from '@/components/search/SearchDropdown';
import { useProductSearch } from '@/hooks/useProductSearch';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { results, loading } = useProductSearch(searchQuery);
  const cartCount = getCartCount();

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>+123-456-789</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Find a Store</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Free delivery on orders $50+</span>
            <Link to="/help" className="hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-wide py-4">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
           
            <span className="hidden sm:block font-display font-bold text-2xl text-foreground">
              Fresh<span className="text-primary">Mart</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for groceries, brands, and more..."
                className="pl-12 pr-4 h-12 rounded-full border-2 border-muted focus:border-primary bg-background"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
            </form>
            {searchOpen && (
              <SearchDropdown
                results={results}
                loading={loading}
                query={searchQuery}
                onClose={() => setSearchOpen(false)}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/account?tab=favorites">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer font-medium text-primary">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="fresh" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg p-0">
                <CartSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-12 pr-4 h-11 rounded-full border-2 border-muted focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:block border-t border-border bg-card">
        <div className="container-wide">
          <ul className="flex items-center gap-1">
            <li
              className="relative"
              onMouseEnter={() => {
                setIsMegaMenuOpen(true);
                setActiveCategory(categories[0].id);
              }}
              onMouseLeave={() => {
                setIsMegaMenuOpen(false);
                setActiveCategory(null);
              }}
            >
              <button className="flex items-center gap-2 px-4 py-3.5 font-medium text-foreground hover:text-primary transition-colors">
                <Menu className="h-4 w-4" />
                All Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Mega Menu */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-0 w-[800px] bg-card rounded-b-xl shadow-xl border border-border animate-slide-down">
                  <div className="flex">
                    {/* Category list */}
                    <div className="w-64 border-r border-border py-4">
                      {categories.slice(0, 8).map((category) => (
                        <button
                          key={category.id}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                            activeCategory === category.id
                              ? 'bg-fresh-light text-primary'
                              : 'hover:bg-muted'
                          }`}
                          onMouseEnter={() => setActiveCategory(category.id)}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Subcategories */}
                    <div className="flex-1 p-6">
                      {categories.map((category) =>
                        activeCategory === category.id && category.subcategories ? (
                          <div key={category.id}>
                            <h3 className="font-display font-semibold text-lg mb-4">{category.name}</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={`/category/${category.slug}/${sub.slug}`}
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                            <Link
                              to={`/category/${category.slug}`}
                              className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                            >
                              View All {category.name} →
                            </Link>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
            
            {['Fresh Deals', 'Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Beverages'].map((item) => (
              <li key={item}>
                <Link
                  to={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-3.5 font-medium text-foreground hover:text-primary transition-colors inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/deals"
                className="px-4 py-3.5 font-semibold text-accent hover:text-coral-dark transition-colors inline-block"
              >
                🔥 Hot Deals
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">F</span>
              </div>
              <span className="font-display font-bold text-2xl">
                Fresh<span className="text-primary">Mart</span>
              </span>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">{category.productCount}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border space-y-1">
              <Link
                to="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>My Account</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
