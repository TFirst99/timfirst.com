import {
  useState,
  useRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";
import FileExplorer, { FileExplorerRef } from "../FileExplorer";
import { TextEditor } from "../TextEditor";
import { FileSystemItem } from "../../types/fileSystem";

export interface WindowManagerRef {
  handleFileSelect: (file: FileSystemItem) => void;
  navigateToFolder: (path: string, selectedFolder?: string) => void;
}

interface Window {
  id: string;
  type: "explorer" | "content";
  zIndex: number;
}

interface WindowManagerProps {
  children: ReactNode;
  onFileSelect: (file: FileSystemItem) => void;
}

export const WindowManager = forwardRef<WindowManagerRef, WindowManagerProps>(
  ({ children, onFileSelect }, ref) => {
    const [windows, setWindows] = useState<Window[]>([]);
    const [selectedFileContent, setSelectedFileContent] = useState<string>("");
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [explorerVisible, setExplorerVisible] = useState(false);
    const [contentWindowVisible, setContentWindowVisible] = useState(false);
    const fileExplorerRef = useRef<FileExplorerRef>(null);

    useImperativeHandle(ref, () => ({
      handleFileSelect,
      navigateToFolder,
    }));

    const bringToFront = (windowId: string) => {
      setWindows((currentWindows) => {
        const maxZ = Math.max(...currentWindows.map((w) => w.zIndex));
        return currentWindows.map((w) => ({
          ...w,
          zIndex: w.id === windowId ? maxZ + 1 : w.zIndex,
        }));
      });
    };

    const closeWindow = (windowId: string) => {
      if (windowId === "explorer") setExplorerVisible(false);
      if (windowId === "content") setContentWindowVisible(false);
    };

    const openWindow = (type: "explorer" | "content") => {
      if (type === "explorer") setExplorerVisible(true);
      if (type === "content") setContentWindowVisible(true);

      const maxZ = Math.max(...windows.map((w) => w.zIndex), 0);
      setWindows((current) => [
        ...current.filter((w) => w.id !== type),
        { id: type, type, zIndex: maxZ + 1 },
      ]);
    };

    const handleFileSelect = async (file: FileSystemItem) => {
      if (file.type === "file" && file.content) {
        setIsLoading(true);
        setSelectedFileName(file.name);
        setContentWindowVisible(true);
        setSelectedFileContent(file.content);
        setIsLoading(false);
        openWindow("content");
      } else if (file.type === "folder") {
        setExplorerVisible(true);
        openWindow("explorer");
      }
    };

    const navigateToFolder = (path: string, selectedFolder?: string) => {
      setExplorerVisible(true);
      openWindow("explorer");

      if (selectedFolder) {
        setTimeout(() => {
          fileExplorerRef.current?.navigateToPath(path, selectedFolder);
        }, 0);
      }
    };

    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          {explorerVisible && (
            <FileExplorer
              ref={fileExplorerRef}
              onFileSelect={onFileSelect}
              zIndex={windows.find((w) => w.id === "explorer")?.zIndex || 10}
              onFocus={() => bringToFront("explorer")}
              onClose={() => closeWindow("explorer")}
            />
          )}
          {contentWindowVisible && (
            <TextEditor
              content={selectedFileContent}
              fileName={selectedFileName}
              isLoading={isLoading}
              zIndex={windows.find((w) => w.id === "content")?.zIndex || 10}
              onFocus={() => bringToFront("content")}
              onClose={() => closeWindow("content")}
            />
          )}
        </div>
        <div className="relative z-0">{children}</div>
      </div>
    );
  },
);

export type { Window };
