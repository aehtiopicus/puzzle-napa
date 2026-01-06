"use client";

import { PlacedPiece } from "@/hooks/use-puzzle-game";
import { PuzzlePiece } from "./puzzle-piece";

interface PuzzleGameBoardProps {
  rows: number;
  cols: number;
  pieceWidth: number;
  pieceHeight: number;
  placedPieces: PlacedPiece[];
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  onDrop: (row: number, col: number, pieceId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onPieceClick?: (pieceId: string) => void;
}

export function PuzzleGameBoard({
  rows,
  cols,
  pieceWidth,
  pieceHeight,
  placedPieces,
  imageUrl,
  imageWidth,
  imageHeight,
  onDrop,
  onDragOver,
  onPieceClick,
}: PuzzleGameBoardProps) {
  const handleDrop = (row: number, col: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("pieceId");
    if (pieceId) {
      onDrop(row, col, pieceId);
    }
  };

  const boardWidth = cols * pieceWidth;
  const boardHeight = rows * pieceHeight;

  // Calculate scale to fit the board in a reasonable size
  const maxBoardSize = 600;
  const scale = Math.min(1, maxBoardSize / Math.max(boardWidth, boardHeight));

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className="relative"
        style={{
          width: `${boardWidth * scale}px`,
          height: `${boardHeight * scale}px`,
        }}
      >
        {/* Grid */}
        <div
          className="grid gap-0 bg-muted/20 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            width: "100%",
            height: "100%",
          }}
        >
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: cols }).map((_, col) => {
              const placedPiece = placedPieces.find(
                (p) => p.position.row === row && p.position.col === col
              );

              return (
                <div
                  key={`${row}-${col}`}
                  className={`
                    relative
                    ${
                      placedPiece
                        ? "z-10" // Bring placed pieces above the grid to overlap correctly
                        : "bg-muted/10 border border-dashed border-muted-foreground/30 z-0"
                    }
                    ${
                      placedPiece?.isCorrect
                        ? "border-none" // Ensure no border on correct pieces
                        : ""
                    }
                    ${
                      placedPiece && !placedPiece.isCorrect
                        ? "bg-red-500/10 border-red-500/50" // Error state can have border
                        : ""
                    }
                  `}
                  onDrop={handleDrop(row, col)}
                  onDragOver={onDragOver}
                  onClick={() =>
                    placedPiece && onPieceClick?.(placedPiece.piece.id)
                  }
                >
                  {placedPiece && (
                    <PuzzlePiece
                      piece={placedPiece.piece}
                      imageUrl={imageUrl}
                      imageWidth={imageWidth}
                      imageHeight={imageHeight}
                      draggable={!placedPiece.isCorrect}
                      scale={scale}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                        placedPiece.isCorrect ? "cursor-default" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Grid labels for debugging - optional */}
        {/* {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <div
              key={`label-${row}-${col}`}
              className="absolute text-xs text-muted-foreground pointer-events-none"
              style={{
                left: `${(col * pieceWidth * scale) + (pieceWidth * scale / 2) - 10}px`,
                top: `${(row * pieceHeight * scale) + (pieceHeight * scale / 2) - 6}px`,
              }}
            >
              {row},{col}
            </div>
          ))
        )} */}
      </div>
    </div>
  );
}
