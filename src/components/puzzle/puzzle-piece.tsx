"use client";

import { cn } from "@/utils";
import { PuzzlePiece as PuzzlePieceType } from "@/utils/puzzle-extractor";

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  onDragStart?: (pieceId: string) => void;
  onDragEnd?: () => void;
  draggable?: boolean;
  className?: string;
  scale?: number;
}

export function PuzzlePiece({
  piece,
  imageUrl,
  imageWidth,
  imageHeight,
  onDragStart,
  onDragEnd,
  draggable = true,
  className = "",
  scale = 1,
}: PuzzlePieceProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("pieceId", piece.id);

    // Clone the element to create a dedicated "ghost" for dragging
    // This effectively "translates" the preview (by centering it) without moving the original logic
    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;

    // Style the ghost to ensure it's rendered correctly for the snapshot
    // We position it off-screen but visible to the browser renderer
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    ghost.style.left = "-9999px";
    ghost.style.zIndex = "1000";
    // Ensure the ghost has no transform that might confuse positioning
    ghost.style.transform = "none";

    document.body.appendChild(ghost);

    // Set the drag image to our clone, centered
    e.dataTransfer.setDragImage(ghost, scaledWidth / 2, scaledHeight / 2);

    // Clean up the ghost element after the browser has taken its snapshot
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);

    onDragStart?.(piece.id);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  // Add padding to prevent clipping of tabs (connectors)
  // Tabs typically extend about 20-25% of the piece size
  const paddingRatio = 0.3;
  const paddingX = piece.width * paddingRatio;
  const paddingY = piece.height * paddingRatio;

  const paddedWidth = piece.width + paddingX * 2;
  const paddedHeight = piece.height + paddingY * 2;

  const scaledWidth = paddedWidth * scale;
  const scaledHeight = paddedHeight * scale;

  // Create a unique clip path ID for this piece
  const clipPathId = `clip-${piece.id}`;

  return (
    <div
      className={cn(
        `puzzle-piece cursor-grab active:cursor-grabbing shrink-0 relative`,
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-piece-id={piece.id}
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
    >
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`${piece.x - paddingX} ${piece.y - paddingY} ${paddedWidth} ${paddedHeight}`}
        className="drop-shadow-md absolute top-0 left-0"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
      >
        <path
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray="10 10"
          fill="none"
          className="text-primary"
          d={piece.clipPath}
        />
        <defs>
          <clipPath id={clipPathId}>
            <path d={piece.clipPath} />
          </clipPath>
        </defs>
        <image
          href={imageUrl}
          x={0}
          y={0}
          width={imageWidth || piece.width}
          height={imageHeight || piece.height}
          preserveAspectRatio="none"
          clipPath={`url(#${clipPathId})`}
        />
      </svg>
    </div>
  );
}
