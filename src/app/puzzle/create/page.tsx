"use client";

import { ImageUploadArea } from "@/components/puzzle/image-upload-area";
import { PuzzleSidebar } from "@/components/puzzle/puzzle-sidebar";
import { PuzzlePattern } from "@/utils/puzzle-config";
import { generatePuzzleLines, PuzzleLine } from "@/utils/puzzle-generator";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function PuzzleCreatePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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

  const handleExport = useCallback(() => {
    if (!imageUrl || !puzzleLines.length || imageDimensions.width === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = imageDimensions.width;
    canvas.height = imageDimensions.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      // 1. Draw the background image
      ctx.drawImage(img, 0, 0, imageDimensions.width, imageDimensions.height);

      // 2. Draw the puzzle lines (matching the overlay style)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Visible white lines
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]); // Dashed pattern
      ctx.lineCap = "round";

      puzzleLines.forEach((line) => {
        const p = new Path2D(line.path);
        ctx.stroke(p);
      });

      // 3. Trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "puzzle-export.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    };
  }, [imageUrl, puzzleLines, imageDimensions]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-3xl font-bold">Puzzle Creator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an image and create your custom jigsaw puzzle
        </p>
      </header>

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
