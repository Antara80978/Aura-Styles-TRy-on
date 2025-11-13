import { useState, useRef, useEffect } from "react";
import { Upload, Video, VideoOff, Sparkles, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LiveTryOn() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        toast.success("📹 Camera started!");
        
        // Start rendering loop
        renderFrame();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsStreaming(false);
  };

  const handleClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setClothingImage(result);
        toast.success("✨ Clothing uploaded! It will appear on the live feed.");
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isStreaming) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay clothing if uploaded
    if (clothingImage) {
      const img = new Image();
      img.src = clothingImage;
      
      // Calculate position (upper torso area)
      const clothingWidth = canvas.width * 0.4;
      const clothingHeight = (img.height / img.width) * clothingWidth;
      const x = (canvas.width - clothingWidth) / 2;
      const y = canvas.height * 0.25;

      // Apply overlay with blend effects
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(img, x, y, clothingWidth, clothingHeight);
      ctx.restore();
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  };

  const captureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `aura-styles-live-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("📸 Snapshot captured!");
      }
    }, "image/png");
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Video className="h-4 w-4" />
            Live Try-On
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Real-Time Virtual Try-On
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See yourself wearing different outfits in real-time using your webcam
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Camera Feed */}
          <Card className="lg:col-span-2 overflow-hidden border-2 border-accent/30 shadow-[var(--shadow-elegant)]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Video className="h-5 w-5 text-accent" />
                  Live Feed
                </h3>
                <div className="flex gap-2">
                  {isStreaming ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={captureSnapshot}
                        className="gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Capture
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={stopCamera}
                        className="gap-2"
                      >
                        <VideoOff className="h-4 w-4" />
                        Stop
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startCamera} className="gap-2">
                      <Video className="h-4 w-4" />
                      Start Camera
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                        <Video className="h-10 w-10 text-accent" />
                      </div>
                      <p className="text-muted-foreground">
                        Click "Start Camera" to begin
                      </p>
                    </div>
                  </div>
                )}
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
              </div>
            </CardContent>
          </Card>

          {/* Clothing Upload */}
          <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-primary" />
                Upload Clothing
              </h3>
              
              <div
                onClick={() => clothingInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all min-h-[280px] flex items-center justify-center"
              >
                {clothingImage ? (
                  <div className="space-y-4">
                    <img
                      src={clothingImage}
                      alt="Selected clothing"
                      className="max-h-48 mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click to change clothing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        Upload clothing item
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG with transparent background works best
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={clothingInputRef}
                type="file"
                accept="image/*"
                onChange={handleClothingUpload}
                className="hidden"
              />

              {clothingImage && isStreaming && (
                <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs text-muted-foreground text-center">
                    ✨ Clothing is now visible on your live feed!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="border-primary/20" style={{ background: 'var(--gradient-card)' }}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              How to Use Live Try-On
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <h4 className="font-medium">Start Camera</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Start Camera" and allow camera access
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                  2
                </div>
                <h4 className="font-medium">Upload Clothing</h4>
                <p className="text-sm text-muted-foreground">
                  Select a clothing item to overlay on your live feed
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <h4 className="font-medium">Capture & Share</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Capture" to save your favorite looks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
