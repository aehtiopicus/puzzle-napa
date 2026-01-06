"use client";

import { Button } from "@/components/ui/button";
import { PuzzleLine } from "@/utils/puzzle-generator";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PuzzleOverlay } from "./puzzle-overlay";

interface ImageUploadAreaProps {
  onImageSelect: (file: File) => void;
  onImageDimensionsChange: (width: number, height: number) => void;
  imageUrl: string | null;
  puzzleLines: PuzzleLine[];
}

export function ImageUploadArea({
  onImageSelect,
  onImageDimensionsChange,
  imageUrl,
  puzzleLines,
}: ImageUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleImageLoad = useCallback(() => {
    // Use displayed dimensions, not natural dimensions
    if (imgRef.current) {
      const width = imgRef.current.clientWidth;
      const height = imgRef.current.clientHeight;
      setImageDimensions({ width, height });
      onImageDimensionsChange(width, height);
    }
  }, [onImageDimensionsChange]);

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current) {
        const width = imgRef.current.clientWidth;
        const height = imgRef.current.clientHeight;
        setImageDimensions({ width, height });
        onImageDimensionsChange(width, height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onImageDimensionsChange]);

  return (
    <div
      className="flex-1 flex items-center justify-center p-8"
      id="img-container"
    >
      {!imageUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-full max-w-2xl h-96
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-4
            transition-colors cursor-pointer
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          <Upload className="w-16 h-16 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              Drag and drop your image here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click the button below to select a file
            </p>
            <Button asChild>
              <label className="cursor-pointer">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            ref={imgRef}
            src={imageUrl}
            alt="Uploaded"
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="max-w-full max-h-full w-auto h-auto rounded-lg shadow-lg"
            onLoad={handleImageLoad}
          />
          {imageDimensions.width > 0 && (
            <PuzzleOverlay
              lines={puzzleLines}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />
          )}
        </div>
      )}
    </div>
  );
}
