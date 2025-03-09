
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

const ImageUpload = ({ imageUrl, setImageUrl }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `coffee_images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('coffee_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('coffee_images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your coffee image has been uploaded.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Coffee" 
            className="w-full h-40 object-cover rounded-md" 
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            id="coffee-image"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label 
            htmlFor="coffee-image"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-6 w-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {isUploading ? 'Uploading...' : 'Upload coffee image'}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              JPG, PNG, GIF up to 5MB
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
