import { ReactNode, useState } from "react";
import Draggable from "react-draggable";

interface WindowProps {
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: string;
  height?: string;
  onFocus?: () => void;
  onClose?: () => void;
  zIndex?: number;
}

export function Window({
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  width = "w-96",
  height = "h-[500px]",
  onFocus,
  onClose,
  zIndex = 0,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds="parent"
      handle=".window-handle"
      onStart={() => {
        setIsDragging(true);
        onFocus?.();
      }}
      onStop={() => setIsDragging(false)}
    >
      <div
        className={`absolute ${width} ${height} bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-200 ${
          isDragging ? "shadow-2xl" : ""
        }`}
        style={{ zIndex }}
        onClick={onFocus}
      >
        {/* macOS-style window header */}
        <div
          className="window-handle h-7 bg-[#E5E5E5] flex items-center px-2 select-none border-b border-[#D1D1D1]"
          style={{ cursor: "grab" }}
        >
          {/* Window controls */}
          <div className="flex items-center space-x-2">
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4444] flex items-center justify-center"
              >
                <span className="sr-only">Close</span>
              </button>
            )}
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          {/* Window title */}
          <h2 className="text-[13px] text-[#4A4A4A] absolute left-1/2 -translate-x-1/2">
            {title}
          </h2>
        </div>

        {/* Window Content */}
        <div className="h-[calc(100%-1.75rem)] overflow-auto select-text">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
