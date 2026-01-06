import { createClient } from "pexels";

// Types for our internal image format
export interface GalleryImage {
  id: number;
  url: string; // The specific landscape-sized URL
  alt: string;
  photographer: string;
  photographer_url: string;
  original_width: number;
  original_height: number;
}

// Check for API key
const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.warn("PEXELS_API_KEY is not set in environment variables.");
}

const client = API_KEY ? createClient(API_KEY) : null;

export const galleryService = {
  async fetchLandscapeImages(
    page: number = 1,
    limit: number = 12
  ): Promise<GalleryImage[]> {
    if (!client) {
      console.error("Pexels client not initialized");
      return [];
    }

    try {
      const response = await client.photos.search({
        query: "landscape",
        per_page: limit,
        page: page,
        orientation: "landscape",
      });

      // Type guard for Photos response (vs Video/Error)
      if ("photos" in response) {
        return response.photos.map((photo) => ({
          id: photo.id,
          // We can use the 'large2x' or 'large' src, or original.
          // Pexels 'landscape' orientation filter is good, but let's grab the 'large' src
          // which is usually 940px wide, or 'original' if we want higher quality.
          // Let's use 'large2x' for retina support on grid.
          url: photo.src.large2x,
          alt: photo.alt || "Landscape puzzle image",
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          original_width: photo.width,
          original_height: photo.height,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching images from Pexels:", error);
      return [];
    }
  },
};
