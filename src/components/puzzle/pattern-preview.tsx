"use client";

import { PuzzlePattern } from "@/utils/puzzle-config";

interface PatternPreviewProps {
  pattern: PuzzlePattern;
}

export function PatternPreview({ pattern }: PatternPreviewProps) {
  // Create a mini preview showing the pattern style
  const getPreviewPath = (pattern: PuzzlePattern): string => {
    const centerX = 30;
    const centerY = 20;
    const size = 12;

    switch (pattern) {
      case "classic":
        // Smooth curved tab
        return `M 15 20 C 18 15, 22 15, 25 20 C 28 15, 32 15, 35 20 C 32 25, 28 25, 25 20 C 22 25, 18 25, 15 20`;

      case "rounded":
        // Circular arc
        return `M 15 20 A ${size} ${size} 0 0 1 ${centerX} ${centerY - size} A ${size} ${size} 0 0 1 45 20`;

      case "angular":
        // Sharp rectangular
        return `M 15 20 L 20 20 L 20 10 L 40 10 L 40 20 L 45 20 L 45 30 L 40 30 L 40 20 L 20 20 L 20 30 L 15 30 Z`;

      case "wave":
        // Sine wave
        return `M 15 20 Q 20 10, 25 20 T 35 20 T 45 20`;
    }
  };

  return (
    <svg
      width="60"
      height="40"
      viewBox="0 0 60 40"
      className="inline-block"
      style={{ verticalAlign: "middle" }}
    >
      <path
        d={getPreviewPath(pattern)}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2 2"
        className="text-foreground"
      />
    </svg>
  );
}
