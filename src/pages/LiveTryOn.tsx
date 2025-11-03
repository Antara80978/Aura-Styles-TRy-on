import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface CartItem { name: string; }

const LiveTryOn: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);

  // Clothes dataset
  const clothes: string[] = ["top1_front.png", "top4_front.png", "top5_front.png", "top6_front.png"];

  // --- Camera controls ---
  const startCamera = () => {
    setIsStreaming(true);
    toast.success("Camera started ✅");
  };
  const stopCamera = () => {
    setIsStreaming(false);
    toast("Camera stopped 📴");
  };

  // --- Select clothing ---
  const selectClothing = (index: number) => {
    fetch(`http://localhost:5000/select/${index}`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setSelectedIndex(index);
          toast.success(`Selected: ${data.file}`);
        } else toast.error(data.message);
      })
      .catch(() => toast.error("Failed to select clothing"));
  };

  // --- Add to cart ---
  const addToCart = (name: string) => {
    fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: name }),
    })
      .then(res => res.json())
      .then(data => {
        setCart(data.cart.map((i: string) => ({ name: i })));
        toast.success(`${name} added to Cart`);
      })
      .catch(() => toast.error("Failed to add to Cart"));
  };

  // --- Add to wishlist ---
  const addToWishlist = (name: string) => {
    fetch("http://localhost:5000/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: name }),
    })
      .then(res => res.json())
      .then(data => {
        setWishlist(data.wishlist.map((i: string) => ({ name: i })));
        toast.success(`${name} added to Wishlist`);
      })
      .catch(() => toast.error("Failed to add to Wishlist"));
  };

  // --- Fetch current cart & wishlist on mount ---
  useEffect(() => {
    fetch("http://localhost:5000/cart")
      .then(res => res.json())
      .then(data => setCart(data.map((i: string) => ({ name: i }))));
    fetch("http://localhost:5000/wishlist")
      .then(res => res.json())
      .then(data => setWishlist(data.map((i: string) => ({ name: i }))));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-gray-800">Live Try-On</h2>

      {/* Camera feed */}
      {isStreaming ? (
        <img
          src="http://localhost:5000/video_feed"
          alt="Live Stream"
          className="rounded-2xl shadow-md border border-gray-300"
          width={480}
          height={360}
        />
      ) : (
        <div className="w-[480px] h-[360px] flex items-center justify-center border border-gray-300 rounded-xl text-gray-500">
          Stream not started
        </div>
      )}

      {/* Camera control buttons */}
      <div className="flex gap-4 mt-2">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Stop Camera
          </button>
        )}
      </div>

      {/* Clothes selection */}
      <div className="flex flex-wrap gap-2 mt-4">
        {clothes.map((file, index) => (
          <div key={index} className="border p-2 rounded-lg flex flex-col items-center">
            <button
              onClick={() => selectClothing(index)}
              className={`px-3 py-1 rounded-xl border ${selectedIndex === index ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
            >
              {file}
            </button>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => addToCart(file)}
                className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-500"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(file)}
                className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart & Wishlist display */}
      <div className="mt-4 w-full max-w-md">
        <h3 className="font-semibold text-lg">Cart:</h3>
        <ul className="list-disc pl-6">
          {cart.map((item, i) => (
            <li key={i}>{item.name}</li>
          ))}
        </ul>

        <h3 className="font-semibold text-lg mt-2">Wishlist:</h3>
        <ul className="list-disc pl-6">
          {wishlist.map((item, i) => (
            <li key={i}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveTryOn;
