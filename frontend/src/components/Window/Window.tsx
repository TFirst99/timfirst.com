import { ReactNode, useState } from "react";
import Draggable from "react-draggable";

interface WindowProps {
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: string;
  height?: string;
  onFocus?: () => void;
  zIndex?: number;
}

export function Window({
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  width = "w-96",
  height = "h-[500px]",
  onFocus,
  zIndex = 0,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      defaultPosition={defaultPosition}
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

          {/* Window Controls (decorative for now) */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 opacity-50" />
            <div className="w-3 h-3 rounded-full bg-slate-500 opacity-50" />
            <div className="w-3 h-3 rounded-full bg-slate-500 opacity-50" />
          </div>
        </div>

        {/* Window Content */}
        <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto select-text">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
