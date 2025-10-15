import { Heart, ShoppingCart, Camera } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={() => onAddToWishlist(product)}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWishlisted && "fill-current text-primary"
            )}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <p className="text-xl font-bold text-primary">${product.price}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          className="flex-1"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon">
          <Camera className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
