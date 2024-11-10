import { useState, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseWindowPositionProps {
  defaultPosition: Position;
  snapThreshold?: number;
}

export const useWindowPosition = ({
  defaultPosition,
  snapThreshold = 50,
}: UseWindowPositionProps) => {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePositionChange = useCallback(
    (newPosition: Position) => {
      // Check if we're near the default position
      const dx = Math.abs(newPosition.x - defaultPosition.x);
      const dy = Math.abs(newPosition.y - defaultPosition.y);

      // If we're within the snap threshold, snap to default position
      if (dx < snapThreshold && dy < snapThreshold) {
        setPosition(defaultPosition);
      } else {
        setPosition(newPosition);
      }
    },
    [defaultPosition, snapThreshold],
  );

  return {
    position,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handlePositionChange,
  };
};
