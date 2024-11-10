import { useState } from "react";
import { Window } from "./components/Window";
import FileExplorer from "./components/FileExplorer";
import { FileSystemItem } from "./types/fileSystem";

function App() {
  const [focusedWindow, setFocusedWindow] = useState<"explorer" | "content">(
    "content",
  );
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === "file" && file.content) {
      setSelectedFileContent(file.content);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-slate-900">
      <div className="w-full h-full p-4">
        <div className="relative w-full h-full">
          <FileExplorer
            onFileSelect={handleFileSelect}
            zIndex={focusedWindow === "explorer" ? 10 : 0}
            onFocus={() => setFocusedWindow("explorer")}
          />

          <Window
            title="Content Viewer"
            defaultPosition={{ x: 400, y: 20 }}
            width="w-[600px]"
            zIndex={focusedWindow === "content" ? 10 : 0}
            onFocus={() => setFocusedWindow("content")}
          >
            <div className="space-y-4">
              {selectedFileContent ? (
                <pre className="whitespace-pre-wrap">{selectedFileContent}</pre>
              ) : (
                <p className="text-slate-400">
                  Select a file to view its contents
                </p>
              )}
            </div>
          </Window>
        </div>
      </div>
    </div>
  );
}

export default App;
