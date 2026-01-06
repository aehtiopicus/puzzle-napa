import { galleryService } from "@/api/services/gallery.service";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const dynamic = "force-dynamic"; // Ensure fresh data on each request if randomized, or cache? Pexels search is static for same query unless we randomize 'page'.
// Actually 'landscape' query results are stable. SSR is good for SEO/Performance.
// Let's allow caching but maybe revalidate every hour?
// For now default (static/dynamic auto) is fine, but since we use search params in API route we might need force-dynamic there.
// Here on component, we just fetch page 1.

export default async function GalleryPage() {
  // SSR Data Fetching
  const initialImages = await galleryService.fetchLandscapeImages(1, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Landscape Gallery
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Browse our collection of high-quality landscape photos. Select one to
          create your puzzle.
        </p>
      </div>

      <GalleryGrid initialImages={initialImages} />
    </div>
  );
}
