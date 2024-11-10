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
        className={`absolute ${width} ${height} bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-shadow duration-200 ${
          isDragging ? "shadow-2xl" : ""
        }`}
        style={{ zIndex }}
        onClick={onFocus}
      >
        {/* Window Title Bar */}
        <div
          className="window-handle h-10 bg-slate-700 flex items-center justify-between px-4 select-none border-b border-slate-600"
          style={{ cursor: "grab" }}
        >
          <h2 className="text-sm font-medium text-slate-200">{title}</h2>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-200 hover:bg-red-500 rounded p-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Window Content */}
        <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto select-text">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
