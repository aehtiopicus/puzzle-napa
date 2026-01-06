import { PuzzlePattern } from "./puzzle-config";
import { generatePiecePath, PuzzleLine } from "./puzzle-generator";

export interface PuzzlePiece {
  id: string;
  row: number;
  col: number;
  clipPath: string; // SVG path for clipping
  x: number; // position in image
  y: number;
  width: number;
  height: number;
}

export interface PuzzleGameData {
  imageUrl: string;
  imageDimensions: { width: number; height: number };
  pieces: PuzzlePiece[];
  rows: number;
  cols: number;
  pieceWidth: number;
  pieceHeight: number;
  pattern: PuzzlePattern; // Added pattern
}

/**
 * Calculate grid dimensions (rows x cols) from piece count
 */
export function calculateGridDimensions(pieceCount: number): {
  rows: number;
  cols: number;
} {
  let cols = Math.round(Math.sqrt(pieceCount));
  cols = Math.max(2, cols);
  let rows = Math.round(pieceCount / cols);
  rows = Math.max(2, rows);

  return { rows, cols };
}

/**
 * Extract individual puzzle pieces from puzzle lines
 */
export function extractPuzzlePieces(
  imageWidth: number,
  imageHeight: number,
  pieceCount: number,
  puzzleLines: PuzzleLine[],
  pattern: PuzzlePattern = "classic"
): PuzzlePiece[] {
  const { rows, cols } = calculateGridDimensions(pieceCount);
  const pieceWidth = imageWidth / cols;
  const pieceHeight = imageHeight / rows;

  const pieces: PuzzlePiece[] = [];

  // Create a piece for each grid position
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * pieceWidth;
      const y = row * pieceHeight;

      // Generate the closed SVG path for this specific piece
      const clipPath = generatePiecePath(
        row,
        col,
        imageWidth,
        imageHeight,
        pieceCount,
        pattern
      );

      pieces.push({
        id: `piece-${row}-${col}`,
        row,
        col,
        x,
        y,
        width: pieceWidth,
        height: pieceHeight,
        clipPath,
      });
    }
  }

  return pieces;
}

/**
 * Shuffle an array of puzzle pieces
 */
export function shufflePieces(pieces: PuzzlePiece[]): PuzzlePiece[] {
  const shuffled = [...pieces];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
