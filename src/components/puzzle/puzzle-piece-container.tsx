"use client";

import { PuzzlePiece as PuzzlePieceType } from "@/utils/puzzle-extractor";
import { PuzzlePiece } from "./puzzle-piece";

interface PuzzlePieceContainerProps {
  pieces: PuzzlePieceType[];
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  onDragStart: (pieceId: string) => void;
  onDragEnd: () => void;
  scale?: number;
}

export function PuzzlePieceContainer({
  pieces,
  imageUrl,
  imageWidth,
  imageHeight,
  onDragStart,
  onDragEnd,
  scale = 0.6,
}: PuzzlePieceContainerProps) {
  return (
    <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Puzzle Pieces</h2>
        <p className="text-sm text-muted-foreground">
          {pieces.length} piece{pieces.length !== 1 ? "s" : ""} remaining
        </p>
      </div>

      <div className="flex flex-col gap-0 justify-center items-center">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="flex justify-center items-center w-full"
          >
            <PuzzlePiece
              piece={piece}
              imageUrl={imageUrl}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              scale={scale}
            />
          </div>
        ))}
      </div>

      {pieces.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>All pieces placed!</p>
        </div>
      )}
    </div>
  );
}
