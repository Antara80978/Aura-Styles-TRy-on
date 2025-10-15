import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Wishlist = () => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist
          </p>
          <Link to="/">
            <Button>Discover Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={(p) => {
                if (isInWishlist(p.id)) {
                  removeFromWishlist(p.id);
                } else {
                  addToWishlist(p);
                }
              }}
              isWishlisted={isInWishlist(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
