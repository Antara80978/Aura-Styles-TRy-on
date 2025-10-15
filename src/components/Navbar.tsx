import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
}

export const Navbar = ({ cartCount, wishlistCount }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-700 bg-clip-text text-transparent">
            AURA STYLES
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/try-on">
            <Button variant="ghost" size="sm">
              Try-On
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
