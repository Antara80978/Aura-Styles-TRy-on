import { useState, useRef } from "react";
import { Upload, Camera, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const TryOn = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const personInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "person" | "clothing"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === "person") {
          setPersonImage(result);
          setPreview(null);
        } else {
          setClothingImage(result);
          setPreview(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!personImage || !clothingImage) {
      toast.error("Please upload both your photo and clothing item");
      return;
    }

    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const personImg = new Image();
    const clothingImg = new Image();

    personImg.onload = () => {
      canvas.width = personImg.width;
      canvas.height = personImg.height;
      
      // Draw person with slight brightness
      ctx.filter = 'brightness(1.05)';
      ctx.drawImage(personImg, 0, 0);
      ctx.filter = 'none';

      clothingImg.onload = () => {
        // Enhanced overlay with better positioning and effects
        const clothingWidth = personImg.width * 0.55;
        const clothingHeight = (clothingImg.height / clothingImg.width) * clothingWidth;
        const x = (personImg.width - clothingWidth) / 2;
        const y = personImg.height * 0.22;

        // Add shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;

        // Apply blend mode for realistic overlay
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.85;
        ctx.drawImage(clothingImg, x, y, clothingWidth, clothingHeight);
        
        // Add highlights
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.2;
        ctx.drawImage(clothingImg, x, y, clothingWidth, clothingHeight);
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = 'transparent';
        
        setPreview(canvas.toDataURL('image/png', 1.0));
        setIsProcessing(false);
        toast.success("✨ Try-on preview generated!");
      };
      clothingImg.src = clothingImage;
    };
    personImg.src = personImage;
  };

  const handleDownload = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = "aura-styles-tryon.png";
    link.href = preview;
    link.click();
    toast.success("Preview downloaded!");
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background via-lavender-light/10 to-background">
      <div className="container max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Static Try-On
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Virtual Try-On Studio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your photo and a clothing item to see how it looks on you with our AI-powered visualization
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Person Image Upload */}
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-[var(--shadow-elegant)]">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5 text-primary" />
                Your Photo
              </h3>
              <div
                onClick={() => personInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all min-h-[320px] flex items-center justify-center"
              >
                {personImage ? (
                  <img
                    src={personImage}
                    alt="Your photo"
                    className="max-h-72 mx-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        Click to upload your photo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Full body photos work best
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={personInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "person")}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Clothing Image Upload */}
          <Card className="overflow-hidden border-2 hover:border-accent/50 transition-all hover:shadow-[var(--shadow-elegant)]">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-accent" />
                Clothing Item
              </h3>
              <div
                onClick={() => clothingInputRef.current?.click()}
                className="border-2 border-dashed border-accent/30 rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all min-h-[320px] flex items-center justify-center"
              >
                {clothingImage ? (
                  <img
                    src={clothingImage}
                    alt="Clothing item"
                    className="max-h-72 mx-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        Click to upload clothing
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Clear product images work best
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG with transparent background recommended
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={clothingInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "clothing")}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button 
            size="lg" 
            onClick={handleTryOn} 
            disabled={!personImage || !clothingImage || isProcessing}
            className="px-8 py-6 text-lg shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isProcessing ? "Processing..." : "Generate Try-On Preview"}
          </Button>
        </div>

        {/* Preview */}
        {preview && (
          <Card className="overflow-hidden border-2 border-primary/30 shadow-[var(--shadow-elegant)]" style={{ background: 'var(--gradient-card)' }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Virtual Try-On
                </h3>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                <img
                  src={preview}
                  alt="Try-on preview"
                  className="max-h-[600px] mx-auto rounded-lg shadow-2xl"
                />
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground text-center">
                  💡 This is an AI-powered visualization. For even more realistic results, try our{" "}
                  <a href="/live-try-on" className="text-primary hover:underline font-medium">
                    Live Try-On feature
                  </a>
                  !
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
