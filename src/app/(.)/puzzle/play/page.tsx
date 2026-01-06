"use client";

import { PuzzleGameBoard } from "@/components/puzzle/puzzle-game-board";
import { PuzzlePieceContainer } from "@/components/puzzle/puzzle-piece-container";
import { Button } from "@/components/ui/button";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { usePuzzleGame } from "@/hooks/use-puzzle-game";
import { PuzzlePattern } from "@/utils/puzzle-config";
import {
  calculateGridDimensions,
  extractPuzzlePieces,
  PuzzlePiece,
  shufflePieces,
} from "@/utils/puzzle-extractor";
import { PuzzleLine } from "@/utils/puzzle-generator";
import { ArrowLeft, RotateCcw, Trophy, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Confetti from "react-confetti-boom";

export default function PuzzlePlayPage() {
  const router = useRouter();

  const [gameData, setGameData] = useState<{
    imageUrl: string;
    pieceCount: number;
    imageWidth: number;
    imageHeight: number;
    puzzleLines: PuzzleLine[];
    pattern: PuzzlePattern;
  } | null>(null);

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });

  // Load game data from localStorage
  useEffect(() => {
    (() => {
      const storedData = localStorage.getItem("puzzleGameData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setGameData(data);

        // Calculate grid dimensions
        const dimensions = calculateGridDimensions(data.pieceCount);
        setGridDimensions(dimensions);

        // Extract and shuffle pieces
        const extractedPieces = extractPuzzlePieces(
          data.imageWidth,
          data.imageHeight,
          data.pieceCount,
          data.puzzleLines,
          data.pattern || "classic"
        );
        setPieces(shufflePieces(extractedPieces));
      } else {
        // No game data, redirect back
        router.push("/puzzle/create");
      }
    })();
  }, [router]);

  const { handleDragStart, handleDragEnd, handleDragOver } = useDragDrop();

  const {
    placedPieces,
    unplacedPieces,
    isComplete,
    placePiece,
    removePiece,
    resetGame,
    onCloseModal,
  } = usePuzzleGame(pieces, gridDimensions.rows, gridDimensions.cols);

  const handleDrop = useCallback(
    (row: number, col: number, pieceId: string) => {
      const piece = [
        ...unplacedPieces,
        ...placedPieces.map((p) => p.piece),
      ].find((p) => p.id === pieceId);
      if (piece) {
        placePiece(piece, row, col);
      }
    },
    [unplacedPieces, placedPieces, placePiece]
  );

  const handlePieceClick = useCallback(
    (pieceId: string) => {
      const placedPiece = placedPieces.find((p) => p.piece.id === pieceId);
      if (placedPiece && !placedPiece.isCorrect) {
        removePiece(pieceId);
      }
    },
    [placedPieces, removePiece]
  );

  const handleReset = useCallback(() => {
    resetGame();
    setPieces(shufflePieces(pieces));
  }, [resetGame, pieces]);

  const handleBackToCreate = () => {
    router.push("/puzzle/create");
  };

  if (!gameData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading puzzle...</p>
      </div>
    );
  }

  const pieceWidth = gameData.imageWidth / gridDimensions.cols;
  const pieceHeight = gameData.imageHeight / gridDimensions.rows;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Puzzle Game</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete the puzzle by dragging pieces to their correct positions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToCreate}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Create
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <PuzzleGameBoard
          rows={gridDimensions.rows}
          cols={gridDimensions.cols}
          pieceWidth={pieceWidth}
          pieceHeight={pieceHeight}
          placedPieces={placedPieces}
          imageUrl={gameData.imageUrl}
          imageWidth={gameData.imageWidth}
          imageHeight={gameData.imageHeight}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPieceClick={handlePieceClick}
        />
        <PuzzlePieceContainer
          pieces={unplacedPieces}
          imageUrl={gameData.imageUrl}
          imageWidth={gameData.imageWidth}
          imageHeight={gameData.imageHeight}
          onDragStart={(id) => handleDragStart(id, "container")}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Completion Modal */}
      {isComplete && (
        <>
          <Confetti
            mode="boom"
            particleCount={500}
            spreadDeg={360}
            colors={["#FF0000", "#00FF00", "#0000FF"]}
            effectCount={3}
          />
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card pb-8 pl-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-end pt-4 pr-4">
                <Button variant="outline" onClick={onCloseModal}>
                  <XIcon />
                </Button>
              </div>
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve completed the puzzle!
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleReset}>Play Again</Button>
                  <Button variant="outline" onClick={handleBackToCreate}>
                    Create New Puzzle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
