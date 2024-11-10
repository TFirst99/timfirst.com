import { useState } from "react";
import { Window } from "./components/Window/Window";

function App() {
  // Track which window is focused
  const [focusedWindow, setFocusedWindow] = useState<"explorer" | "content">(
    "content",
  );

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-slate-900">
      {/* Desktop Container */}
      <div className="w-full h-full p-4">
        {/* Desktop Icons */}
        <div className="absolute left-4 top-4 space-y-4">
          {/* Icons will go here */}
        </div>

        {/* Windows Container */}
        <div className="relative w-full h-full">
          {/* Test with two windows */}
          <Window
            title="File Explorer"
            defaultPosition={{ x: 20, y: 20 }}
            width="w-80"
            zIndex={focusedWindow === "explorer" ? 10 : 0}
            onFocus={() => setFocusedWindow("explorer")}
          >
            <div className="space-y-2">
              <p>File Explorer Content</p>
              <p>Try dragging this window by its title bar!</p>
            </div>
          </Window>

          <Window
            title="Content Viewer"
            defaultPosition={{ x: 400, y: 20 }}
            width="w-[600px]"
            zIndex={focusedWindow === "content" ? 10 : 0}
            onFocus={() => setFocusedWindow("content")}
          >
            <div className="space-y-4">
              <h1 className="text-xl font-bold">Content Window</h1>
              <p>This is the main content window. You can:</p>
              <ul className="list-disc pl-4">
                <li>Drag it around by the title bar</li>
                <li>Click to bring it to front</li>
                <li>Scroll if content overflows</li>
              </ul>
            </div>
          </Window>
        </div>
      </div>
    </div>
  );
}

export default App;
