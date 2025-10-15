import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Shop } from "./pages/Shop";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { TryOn } from "./pages/TryOn";
import NotFound from "./pages/NotFound";
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";

const queryClient = new QueryClient();

const AppContent = () => {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <>
      <Navbar cartCount={itemCount} wishlistCount={wishlist.length} />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/try-on" element={<TryOn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
