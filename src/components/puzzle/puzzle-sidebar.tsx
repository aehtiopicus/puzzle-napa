"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Play } from "lucide-react";

import { PUZZLE_PATTERNS, PuzzlePattern } from "@/utils/puzzle-config";
import { useMemo } from "react";
import { PatternPreview } from "./pattern-preview";

interface PuzzleSidebarProps {
  pieceCount: number;
  onPieceCountChange: (count: number) => void;
  pattern: PuzzlePattern;
  onPatternChange: (pattern: PuzzlePattern) => void;
  onGenerate: () => void;
  onPlayGame: () => void;
  onExport: () => void;
  disabled: boolean;
  canPlay: boolean;
}

export function PuzzleSidebar({
  pieceCount,
  onPieceCountChange,
  pattern,
  onPatternChange,
  onGenerate,
  onPlayGame,
  onExport,
  disabled,
  canPlay,
}: PuzzleSidebarProps) {
  const numberOfPiecesSelector = useMemo(() => {
    const generateMaxPieces = (pieces = 2, acc: number[] = [], limit = 100) => {
      let cols = Math.round(Math.sqrt(pieces * 1));

      // Ensure we have at least 2 columns before calculating rows
      cols = Math.max(2, cols);
      let rows = Math.round(pieces / cols);

      // Ensure we have at least 2 rows
      rows = Math.max(2, rows);

      const nextPieces = cols * rows;
      debugger;
      if (isNaN(nextPieces)) {
        return acc;
      }
      if (!acc.includes(nextPieces)) {
        acc.push(nextPieces);
        if (limit) {
          limit--;
          return generateMaxPieces(nextPieces + 1, acc, limit);
        }
        return acc;
      }

      return generateMaxPieces(pieces + 1, acc, limit);
    };
    return generateMaxPieces();
  }, []);
  return (
    <div className="w-80 border-l border-border bg-card p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Puzzle Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your puzzle pieces
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="piece-count">Number of Pieces</Label>
          <Select
            value={pieceCount.toString()}
            onValueChange={(value) => onPieceCountChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger id="piece-count">
              <SelectValue placeholder="Select piece count" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {numberOfPiecesSelector.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} pieces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Recommended: 9-36 pieces for best results
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pattern">Connector Pattern</Label>
          <Select
            value={pattern}
            onValueChange={(value) => onPatternChange(value as PuzzlePattern)}
            disabled={disabled}
          >
            <SelectTrigger id="pattern">
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              {PUZZLE_PATTERNS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <PatternPreview pattern={p.id} />
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={onGenerate}
          disabled={disabled}
          className="w-full"
          size="lg"
        >
          Generate Puzzle
        </Button>

        <Button
          onClick={onPlayGame}
          disabled={!canPlay}
          className="w-full"
          size="lg"
          variant="secondary"
        >
          <Play className="w-4 h-4 mr-2" />
          Play Game
        </Button>

        <Button
          onClick={onExport}
          disabled={!canPlay}
          className="w-full"
          size="lg"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download SVG
        </Button>

        {disabled && (
          <p className="text-xs text-muted-foreground text-center">
            Upload an image to get started
          </p>
        )}
        {!disabled && !canPlay && (
          <p className="text-xs text-muted-foreground text-center">
            Generate a puzzle first
          </p>
        )}
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2 text-sm">Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use high-quality images for better results</li>
          <li>• Start with fewer pieces if you&apos;re new</li>
          <li>• Click &quot;Generate&quot; to create new puzzle lines</li>
        </ul>
      </Card>
    </div>
  );
}
