"use client";

import { DragEvent, useCallback, useState } from "react";

export interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedFrom: "container" | "board" | null;
}

export function useDragDrop() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItemId: null,
    draggedFrom: null,
  });

  const handleDragStart = useCallback(
    (itemId: string, from: "container" | "board") => {
      setDragState({
        isDragging: true,
        draggedItemId: itemId,
        draggedFrom: from,
      });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedFrom: null,
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault(); // Allow drop
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
