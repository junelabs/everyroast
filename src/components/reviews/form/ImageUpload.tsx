
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  helpText?: string;
}

const ImageUpload = ({ imageUrl, setImageUrl, helpText }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Upload image
    setIsUploading(true);
    
    try {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('coffee-images')
        .upload(filename, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('coffee-images')
        .getPublicUrl(data.path);
      
      setImageUrl(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">
          Coffee Bag Image
        </label>
        {helpText && (
          <p className="text-xs text-gray-500">{helpText}</p>
        )}
      </div>
      
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Coffee bag" 
            className="w-full h-48 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-70 rounded-full text-white"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            id="coffee-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <Image className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload coffee bag photo</p>
            <label htmlFor="coffee-image">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </>
                )}
              </Button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
