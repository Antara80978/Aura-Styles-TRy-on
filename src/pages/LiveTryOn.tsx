import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { products } from "@/data/products";

export const LiveTryOn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        toast.success("Camera started");
        
        // Start rendering loop
        renderFrame();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsStreaming(false);
    toast.info("Camera stopped");
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setClothingImage(img);
        toast.success(`Selected ${product.title}`);
      };
      img.onerror = () => {
        toast.error("Failed to load clothing image");
      };
      img.src = product.image;
    }
  };

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay clothing if selected
    if (clothingImage) {
      // Simple overlay positioned at upper body
      const overlayWidth = canvas.width * 0.5;
      const overlayHeight = (clothingImage.height / clothingImage.width) * overlayWidth;
      const x = (canvas.width - overlayWidth) / 2;
      const y = canvas.height * 0.15;

      ctx.save();
      ctx.globalAlpha = 0.8; // Slight transparency for better blending
      ctx.drawImage(clothingImage, x, y, overlayWidth, overlayHeight);
      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(renderFrame);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Live Try-On</h1>
          <p className="text-muted-foreground text-lg">
            See how clothes look on you in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                {isStreaming ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="hidden"
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={stopCamera}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click start to begin live try-on
                      </p>
                      <Button onClick={startCamera}>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Select Product</h3>
              <Select value={selectedProduct || ""} onValueChange={handleProductSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProduct && (
                <div className="mt-6">
                  <img
                    src={products.find(p => p.id === selectedProduct)?.image}
                    alt="Selected product"
                    className="w-full rounded-lg shadow-md"
                  />
                  <p className="mt-3 font-medium">
                    {products.find(p => p.id === selectedProduct)?.title}
                  </p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ${products.find(p => p.id === selectedProduct)?.price}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium mb-2">How it works:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Start your camera</li>
                  <li>Select a product to try on</li>
                  <li>Position yourself in frame</li>
                  <li>See the clothing overlay in real-time</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            This is a basic real-time overlay. For more accurate fitting with pose detection, 
            advanced ML models can be integrated.
          </p>
        </div>
      </div>
    </div>
  );
};
