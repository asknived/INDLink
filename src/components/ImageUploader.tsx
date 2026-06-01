"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface Props {
  type: "avatar" | "cover" | "background";
  aspectRatio?: number;
  onSuccess: (url: string, key: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ type, aspectRatio = 1, onSuccess, currentImage }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setShowCrop(true);
      });
      reader.readAsDataURL(selectedFile);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        if (file) {
          resolve(new File([file], "cropped.webp", { type: "image/webp" }));
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/webp", 0.9);
    });
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);

    try {
      // 1. Crop Image
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 2. Compress Image
      const compressedFile = await imageCompression(croppedFile, {
        maxSizeMB: type === 'avatar' ? 2 : 5,
        maxWidthOrHeight: type === 'avatar' ? 512 : 1920,
        useWebWorker: true,
        fileType: "image/webp"
      });

      // 3. Get Presigned URL
      const prepRes = await fetch("/api/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          fileName: "upload.webp",
          fileSize: compressedFile.size,
          mimeType: compressedFile.type
        })
      });

      const { uploadUrl, key, finalUrl, error } = await prepRes.json();
      if (error) throw new Error(error);

      // 4. Upload directly to S3/R2
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": compressedFile.type },
        body: compressedFile
      });

      // 5. Finalize DB Record
      const finRes = await fetch("/api/media/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          key,
          finalUrl,
          fileSize: compressedFile.size,
          mimeType: compressedFile.type
        })
      });

      if (finRes.ok) {
        setShowCrop(false);
        setImageSrc(null);
        onSuccess(finalUrl, key);
      }
    } catch (e: any) {
      alert(e.message || "Upload failed");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && !imageSrc && (
        <div className="relative border rounded-lg overflow-hidden flex items-center justify-center bg-muted/30" style={{ aspectRatio }}>
          <img src={currentImage} alt={type} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="outline" className="relative">
          <UploadCloud className="h-4 w-4 mr-2" />
          {currentImage ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onFileChange}
          />
        </Button>
      </div>

      <Dialog open={showCrop} onOpenChange={setShowCrop}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-[400px] w-full bg-black/10 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCrop(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Save Image"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
