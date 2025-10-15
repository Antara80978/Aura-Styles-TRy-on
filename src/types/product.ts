export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  addedAt: Date;
}
