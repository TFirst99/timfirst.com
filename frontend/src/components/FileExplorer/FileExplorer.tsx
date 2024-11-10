import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Window } from "../Window";
import { Folder, File } from "lucide-react";
import { fileSystemData } from "../../data/fileSystem";
import { FileSystemItem } from "../../types/fileSystem";

export interface FileExplorerRef {
  navigateToPath: (path: string, selectedFolder?: string) => void;
}

interface FileExplorerProps {
  onFileSelect: (file: FileSystemItem) => void;
  zIndex?: number;
  onFocus?: () => void;
  onClose?: () => void;
}

const FileExplorerColumn: React.FC<{
  path: string;
  items: FileSystemItem[];
  selectedItem: string | null;
  onItemSelect: (item: FileSystemItem, path: string) => void;
}> = ({ path, items, selectedItem, onItemSelect }) => (
  <div className="flex-1 border-r border-[#E5E5E5] h-full overflow-y-auto">
    <div className="space-y-0.5 p-1">
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onItemSelect(item, path)}
          className={`w-full flex items-center px-2 py-1 rounded-md text-left
            ${
              selectedItem === item.name
                ? "bg-[#0051FE] text-white"
                : "text-[#4A4A4A] hover:bg-[#F5F5F5]"
            }`}
        >
          {item.type === "folder" ? (
            <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
          ) : (
            <File className="w-4 h-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate text-sm">{item.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const FileExplorer = forwardRef<FileExplorerRef, FileExplorerProps>(
  ({ onFileSelect, zIndex, onFocus, onClose }, ref) => {
    const [currentPath, setCurrentPath] = useState("/");
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      navigateToPath: (path: string, initialSelectedFolder?: string) => {
        setCurrentPath(path);
        setSelectedFolder(initialSelectedFolder || null);
      },
    }));

    const getCurrentPathItems = () => fileSystemData[currentPath] || [];

    const getSelectedFolderItems = () => {
      if (!selectedFolder) return [];
      const path =
        currentPath === "/"
          ? `/${selectedFolder}`
          : `${currentPath}/${selectedFolder}`;
      return fileSystemData[path] || [];
    };

    const handleItemSelect = (item: FileSystemItem, parentPath: string) => {
      if (item.type === "folder") {
        if (parentPath === currentPath) {
          // Clicking folder in left column
          setSelectedFolder(item.name);
        } else {
          // Clicking folder in right column
          const newPath =
            parentPath === "/" ? `/${item.name}` : `${parentPath}/${item.name}`;
          setCurrentPath(newPath);
          setSelectedFolder(null);
        }
      } else {
        onFileSelect(item);
      }
    };

    return (
      <Window
        title="Files"
        width="w-[600px]"
        defaultPosition={{ x: 130, y: 20 }}
        zIndex={zIndex}
        onFocus={onFocus}
        onClose={onClose}
      >
        <div className="flex flex-col h-full">
          {/* Path breadcrumb */}
          <div className="px-3 py-2 border-b border-[#E5E5E5] text-sm text-[#4A4A4A] bg-[#F5F5F5]">
            <button
              onClick={() => {
                setCurrentPath("/");
                setSelectedFolder(null);
              }}
              className="hover:text-[#0051FE]"
            >
              timfirst
            </button>
            {currentPath !== "/" && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#4A4A4A]">{currentPath.slice(1)}</span>
              </>
            )}
          </div>

          {/* Columns container */}
          <div className="flex flex-1 overflow-hidden">
            {/* Current folder column */}
            <FileExplorerColumn
              path={currentPath}
              items={getCurrentPathItems()}
              selectedItem={selectedFolder}
              onItemSelect={handleItemSelect}
            />

            {/* Selected folder contents column */}
            <FileExplorerColumn
              path={
                selectedFolder
                  ? `${currentPath}/${selectedFolder}`
                  : currentPath
              }
              items={getSelectedFolderItems()}
              selectedItem={null}
              onItemSelect={handleItemSelect}
            />
          </div>
        </div>
      </Window>
    );
  },
);

export default FileExplorer;
