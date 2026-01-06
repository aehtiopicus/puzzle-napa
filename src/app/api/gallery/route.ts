import { galleryService } from "@/api/services/gallery.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  try {
    const images = await galleryService.fetchLandscapeImages(page, limit);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Gallery API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
