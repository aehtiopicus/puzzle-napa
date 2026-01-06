"use client";

import { PuzzlePiece } from "@/utils/puzzle-extractor";
import { useCallback, useEffect, useState } from "react";

export interface PlacedPiece {
  piece: PuzzlePiece;
  position: { row: number; col: number };
  isCorrect: boolean;
}

export function usePuzzleGame(
  pieces: PuzzlePiece[],
  rows: number,
  cols: number
) {
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [unplacedPieces, setUnplacedPieces] = useState<PuzzlePiece[]>(pieces);
  const [isComplete, setIsComplete] = useState(false);

  const placePiece = useCallback(
    (piece: PuzzlePiece, row: number, col: number) => {
      const isCorrect = piece.row === row && piece.col === col;

      // Check for existing piece at this position BEFORE updating state
      const existingAtPosition = placedPieces.find(
        (p) => p.position.row === row && p.position.col === col
      );

      // 1. Update Unplaced Pieces
      setUnplacedPieces((prev) => {
        const newUnplaced = [...prev];

        // If there's a piece at this position, move it back to unplaced
        if (existingAtPosition) {
          // Prevent duplicates: Only add if not already in the list
          if (!newUnplaced.some((p) => p.id === existingAtPosition.piece.id)) {
            newUnplaced.push(existingAtPosition.piece);
          }
        }

        // Remove the piece being placed from unplaced list (if it was there)
        return newUnplaced.filter((p) => p.id !== piece.id);
      });

      // 2. Update Placed Pieces
      setPlacedPieces((prev) => {
        // Filter out both the piece being placed (if it was already placed elsewhere)
        // and any piece at the target position (it was moved to unplaced above)
        const filtered = prev.filter(
          (p) =>
            p.piece.id !== piece.id &&
            !(p.position.row === row && p.position.col === col)
        );

        return [...filtered, { piece, position: { row, col }, isCorrect }];
      });

      // Check if puzzle is complete relies on updated state, but we can approximate check
      // OR wait for next render. The original code checked immediately with stale state + 1
      // simpler to keep it basic or move to useEffect.
      // Keeping original simple check logic but safe:
      if (isCorrect) {
        // Note: placedPieces here is stale, so this check might lag one step behind
        // correctly unless we calculate 'filtered' length.
        // However, standard React pattern usually puts completion check in useEffect.
        // For now, let's leave it as is, or use functional update result if we could.
        // Actually, let's fix the check to use the calculated state conceptually:
        // But preventing deep complexity change, let's stick to simple trigger.
        // A better approach for completion is useEffect([placedPieces]).
      }
    },
    [placedPieces]
  );

  // Effect to check completion
  useEffect(() => {
    (() => {
      if (placedPieces.length === rows * cols) {
        const allCorrect = placedPieces.every((p) => p.isCorrect);
        if (allCorrect) {
          setIsComplete(true);
        }
      }
    })();
  }, [placedPieces, rows, cols]);

  const removePiece = useCallback((pieceId: string) => {
    setPlacedPieces((prev) => {
      const removed = prev.find((p) => p.piece.id === pieceId);
      if (removed) {
        setUnplacedPieces((unplaced) => {
          // Prevent duplicates
          if (unplaced.some((p) => p.id === pieceId)) {
            return unplaced;
          }
          return [...unplaced, removed.piece];
        });
      }
      return prev.filter((p) => p.piece.id !== pieceId);
    });
  }, []);

  const resetGame = useCallback(() => {
    setPlacedPieces([]);
    setUnplacedPieces(pieces);
    setIsComplete(false);
  }, [pieces]);

  useEffect(() => {
    (() => {
      resetGame();
    })();
  }, [resetGame]);

  const isPieceAtPosition = useCallback(
    (row: number, col: number): PlacedPiece | null => {
      return (
        placedPieces.find(
          (p) => p.position.row === row && p.position.col === col
        ) || null
      );
    },
    [placedPieces]
  );

  return {
    placedPieces,
    unplacedPieces,
    isComplete,
    placePiece,
    removePiece,
    resetGame,
    isPieceAtPosition,
    onCloseModal: () => setIsComplete(false),
  };
}
