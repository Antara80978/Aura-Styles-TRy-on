import { useState, useRef } from "react";
import { Upload, Camera, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const TryOn = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
        } else {
          setClothingImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!personImage || !clothingImage) {
      toast.error("Please upload both person and clothing images");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const personImg = new Image();
    const clothingImg = new Image();

    personImg.onload = () => {
      canvas.width = personImg.width;
      canvas.height = personImg.height;
      
      // Draw person
      ctx.drawImage(personImg, 0, 0);

      clothingImg.onload = () => {
        // Simple overlay - position clothing at upper body area
        const clothingWidth = personImg.width * 0.6;
        const clothingHeight = (clothingImg.height / clothingImg.width) * clothingWidth;
        const x = (personImg.width - clothingWidth) / 2;
        const y = personImg.height * 0.2; // Position at upper torso

        ctx.drawImage(clothingImg, x, y, clothingWidth, clothingHeight);
        
        setPreview(canvas.toDataURL());
        toast.success("Try-on preview generated!");
      };
      clothingImg.src = clothingImage;
    };
    personImg.src = personImage;
  };

  const handleDownload = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = "aura-tryon-preview.png";
    link.href = preview;
    link.click();
    toast.success("Preview downloaded!");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Virtual Try-On</h1>
          <p className="text-muted-foreground text-lg">
            Upload your photo and a clothing item to see how it looks on you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Person Image Upload */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Your Photo
              </h3>
              <div
                onClick={() => personInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {personImage ? (
                  <img
                    src={personImage}
                    alt="Person"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Click to upload your photo
                    </p>
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
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Clothing Item
              </h3>
              <div
                onClick={() => clothingInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {clothingImage ? (
                  <img
                    src={clothingImage}
                    alt="Clothing"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Click to upload clothing image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Transparent PNG recommended
                    </p>
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
          <Button size="lg" onClick={handleTryOn} disabled={!personImage || !clothingImage}>
            Generate Try-On Preview
          </Button>
        </div>

        {/* Preview */}
        {preview && (
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Preview</h3>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="bg-background rounded-lg p-4">
                <img
                  src={preview}
                  alt="Try-on preview"
                  className="max-h-96 mx-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                This is a basic overlay preview. For more accurate fitting, consider using our live try-on feature.
              </p>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
