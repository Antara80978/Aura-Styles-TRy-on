import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("aura-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("aura-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        toast.info("Already in wishlist");
        return prev;
      }
      toast.success("Added to wishlist");
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
