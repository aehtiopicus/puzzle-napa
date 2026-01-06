"use client";

import { GalleryImage } from "@/api/services/gallery.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGallery } from "@/hooks/use-gallery";
import { EyeIcon, PuzzleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GalleryGridProps {
  initialImages: GalleryImage[];
}

export function GalleryGrid({ initialImages }: GalleryGridProps) {
  const { images, loading, observerTarget, hasMore } =
    useGallery(initialImages);
  const router = useRouter();

  const handleViewImage = (image: GalleryImage) => {
    window.open(image.url, "_blank");
  };

  const handleCreatePuzzle = (image: GalleryImage) => {
    // Navigate to create page with image URL as query param
    router.push(`/puzzle/create?image=${encodeURIComponent(image.url)}`);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card
            key={`${image.id}-${image.url}`} // Use combo key in case uniqueness fails
            className="group overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-muted/20"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* Use standard img for simplicity over Next/Image for external URLs without config */}
              <Image
                src={image.url}
                alt={image.alt}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={image.original_width}
                height={image.original_height}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex opacity-0 group-hover:opacity-100 justify-between flex-col">
                <div className="p-3 flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewImage(image)}
                    title="View Original"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCreatePuzzle(image)}
                    title="Create Puzzle"
                  >
                    <PuzzleIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3">
                  <p className="text-xs  truncate text-secondary">
                    Photo by{" "}
                    <a
                      href={image.photographer_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {image.photographer}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center p-4">
          {loading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-sm text-muted-foreground">
              Scroll for more...
            </span>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-muted-foreground py-8">
          You&apos;ve reached the end of the gallery.
        </div>
      )}
    </div>
  );
}
