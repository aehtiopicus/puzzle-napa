"use client";

import { ImageUploadArea } from "@/components/puzzle/image-upload-area";
import { PuzzleSidebar } from "@/components/puzzle/puzzle-sidebar";
import { PuzzlePattern } from "@/utils/puzzle-config";
import { generatePuzzleLines, PuzzleLine } from "@/utils/puzzle-generator";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function PuzzleCreatePage({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Handle image query param from Gallery
  useEffect(() => {
    (async () => {
      const imageParam = searchParams.get("image");
      if (imageParam) {
        // Decode if needed, though searchParams.get usually handles decoding of param values
        setImageUrl(imageParam);
      }
    })();
  }, [searchParams]);

  const [pieceCount, setPieceCount] = useState<number>(4);
  const [pattern, setPattern] = useState<PuzzlePattern>("classic");
  const [puzzleLines, setPuzzleLines] = useState<PuzzleLine[]>([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageSelect = useCallback((file: File) => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Cleanup function
    return () => URL.revokeObjectURL(url);
  }, []);

  const handleDimensionsChange = useCallback(
    (width: number, height: number) => {
      setImageDimensions({ width, height });

      // Auto-generate puzzle lines when dimensions are available
      if (width > 0 && height > 0) {
        const lines = generatePuzzleLines(width, height, pieceCount, pattern);
        setPuzzleLines(lines);
      }
    },
    [pieceCount, pattern]
  );

  const handleGenerate = useCallback(() => {
    if (imageDimensions.width > 0 && imageDimensions.height > 0) {
      const lines = generatePuzzleLines(
        imageDimensions.width,
        imageDimensions.height,
        pieceCount,
        pattern
      );
      setPieceCount(pieceCount);
      setPuzzleLines(lines);
    }
  }, [imageDimensions, pieceCount, pattern]);

  const handlePieceCountChange = useCallback((count: number) => {
    setPieceCount(count);
  }, []);

  const handlePatternChange = useCallback((newPattern: PuzzlePattern) => {
    setPattern(newPattern);
  }, []);

  const handlePlayGame = useCallback(() => {
    if (imageUrl && puzzleLines.length > 0 && imageDimensions.width > 0) {
      // Store puzzle data in localStorage
      const gameData = {
        imageUrl,
        pieceCount,
        imageWidth: imageDimensions.width,
        imageHeight: imageDimensions.height,
        puzzleLines,
        pattern,
      };
      localStorage.setItem("puzzleGameData", JSON.stringify(gameData));

      // Navigate to play page
      router.push("/puzzle/play");
    }
  }, [
    imageUrl,
    puzzleLines,
    imageDimensions.width,
    imageDimensions.height,
    pieceCount,
    pattern,
    router,
  ]);

  const handleExport = useCallback(async () => {
    if (!imageUrl || !puzzleLines.length || imageDimensions.width === 0) return;

    try {
      // 1. Convert image to Base64 to embed in SVG (makes it portable)
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result as string;

        // 2. Construct SVG content
        const svgContent = `
          <svg 
            width="${imageDimensions.width}" 
            height="${imageDimensions.height}" 
            viewBox="0 0 ${imageDimensions.width} ${imageDimensions.height}" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <image href="${base64data}" width="${imageDimensions.width}" height="${imageDimensions.height}" />
            <g 
              stroke="rgba(255, 255, 255, 0.8)" 
              stroke-width="4" 
              stroke-dasharray="8 8" 
              stroke-linecap="round" 
              fill="none"
            >
              ${puzzleLines
                .map((line) => `<path d="${line.path}" />`)
                .join("\n")}
            </g>
          </svg>
        `.trim();

        // 3. Trigger download
        const url = URL.createObjectURL(
          new Blob([svgContent], { type: "image/svg+xml" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "puzzle-export.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error exporting SVG:", error);
    }
  }, [imageUrl, puzzleLines, imageDimensions]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ImageUploadArea
          onImageSelect={handleImageSelect}
          onImageDimensionsChange={handleDimensionsChange}
          imageUrl={imageUrl}
          puzzleLines={puzzleLines}
        />
        <PuzzleSidebar
          pieceCount={pieceCount}
          onPieceCountChange={handlePieceCountChange}
          pattern={pattern}
          onPatternChange={handlePatternChange}
          onGenerate={handleGenerate}
          onPlayGame={handlePlayGame}
          onExport={handleExport}
          disabled={!imageUrl}
          canPlay={!!imageUrl && puzzleLines.length > 0}
        />
      </div>
    </div>
  );
}
