"use client";

import { PuzzleLine } from "@/utils/puzzle-generator";

interface PuzzleOverlayProps {
  lines: PuzzleLine[];
  width: number;
  height: number;
}

export function PuzzleOverlay({ lines, width, height }: PuzzleOverlayProps) {
  if (!lines.length) return null;

  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      {lines.map((line, index) => (
        <path
          key={index}
          d={line.path}
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="5 5"
          fill="none"
          className="text-primary"
        />
      ))}
    </svg>
  );
}
