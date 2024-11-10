import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Window } from "../Window";
import FileExplorer, { FileExplorerRef } from "../FileExplorer";
import { DesktopIcon } from "../DesktopIcon";
import { FileSystemItem, DesktopShortcut } from "../../types/fileSystem";
import { Loader } from "lucide-react";
import { fileSystemData } from "../../data/fileSystem";
import { desktopItems } from "../../data/desktopItems";

export default function Desktop() {
  const [focusedWindow, setFocusedWindow] = useState<"explorer" | "content">(
    "content",
  );
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [explorerVisible, setExplorerVisible] = useState(false);
  const [contentWindowVisible, setContentWindowVisible] = useState(false);
  const fileExplorerRef = useRef<FileExplorerRef>(null);

  const handleFileSelect = async (file: FileSystemItem) => {
    if (file.type === "file" && file.content) {
      setIsLoading(true);
      setSelectedFileName(file.name);
      setContentWindowVisible(true);

      setSelectedFileContent(file.content);
      setIsLoading(false);
      setFocusedWindow("content");
    } else if (file.type === "folder") {
      setExplorerVisible(true);
      setFocusedWindow("explorer");
    }
  };

  const handleDesktopItemClick = async (item: DesktopShortcut) => {
    switch (item.type) {
      case "file":
        if (item.path) {
          const pathParts = item.path.split("/").filter((part) => part);
          const parentPath =
            pathParts.length > 1 ? `/${pathParts.slice(0, -1).join("/")}` : "/";
          const fileName = pathParts[pathParts.length - 1];
          const parentDir = fileSystemData[parentPath];
          const file = parentDir?.find((f) => f.name === fileName);

          if (file) {
            handleFileSelect(file);
          }
        }
        break;

      case "app":
        if (item.name === "Files") {
          setExplorerVisible(true);
          setFocusedWindow("explorer");
        }
        break;

      case "folder":
        if (item.path) {
          setExplorerVisible(true);
          setFocusedWindow("explorer");

          const pathParts = item.path.split("/").filter((part) => part);
          if (pathParts.length > 0) {
            const parentPath =
              pathParts.length > 1
                ? `/${pathParts.slice(0, -1).join("/")}`
                : "/";
            const selectedFolder = pathParts[pathParts.length - 1];
            if (!explorerVisible) {
              setExplorerVisible(true);
              setFocusedWindow("explorer");
              setTimeout(() => {
                fileExplorerRef.current?.navigateToPath(
                  parentPath,
                  selectedFolder,
                );
              }, 0);
            } else {
              fileExplorerRef.current?.navigateToPath(
                parentPath,
                selectedFolder,
              );
            }
          }
        }
        break;
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 p-4">
      {/* Windows Layer */}
      <div className="absolute inset-0">
        {explorerVisible && (
          <FileExplorer
            ref={fileExplorerRef}
            onFileSelect={handleFileSelect}
            zIndex={focusedWindow === "explorer" ? 11 : 10}
            onFocus={() => setFocusedWindow("explorer")}
            onClose={() => setExplorerVisible(false)}
          />
        )}

        {contentWindowVisible && (
          <Window
            title={selectedFileName || "Content Viewer"}
            defaultPosition={{ x: 800, y: 20 }}
            width="w-[600px]"
            zIndex={focusedWindow === "content" ? 11 : 10}
            onFocus={() => setFocusedWindow("content")}
            onClose={() => setContentWindowVisible(false)}
          >
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              ) : selectedFileContent ? (
                <div className="prose prose-invert prose-slate max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="text-slate-300"
                  >
                    {selectedFileContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-slate-400">
                  Select a file to view its contents
                </p>
              )}
            </div>
          </Window>
        )}
      </div>

      {/* Desktop Icons Layer */}
      <div className="relative z-0 flex flex-col items-start gap-4">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.name}
            item={item}
            onClick={handleDesktopItemClick}
          />
        ))}
      </div>
    </div>
  );
}
