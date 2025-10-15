import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart}>
            Clear All
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-3xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
