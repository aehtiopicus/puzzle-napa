import { GalleryImage } from "@/api/services/gallery.service";
import { useCallback, useEffect, useRef, useState } from "react";

export function useGallery(initialImages: GalleryImage[]) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/gallery?page=${nextPage}&limit=12`);

      if (!res.ok) throw new Error("Failed to fetch");

      const newImages = await res.json();

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        setImages((prev) => [...prev, ...newImages]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return { images, loading, observerTarget, hasMore };
}
