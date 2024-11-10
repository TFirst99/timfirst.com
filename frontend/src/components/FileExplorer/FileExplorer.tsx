import React, { useState } from "react";
import { Window } from "../Window/Window";
import { Folder, File } from "lucide-react";
import { fileSystemData } from "../../data/fileSystem";
import { FileSystemItem } from "../../types/fileSystem";

interface FileExplorerProps {
  onFileSelect: (file: FileSystemItem) => void;
  zIndex?: number;
  onFocus?: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  onFileSelect,
  zIndex,
  onFocus,
}) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [currentFolder, setCurrentFolder] = useState("/");

  const handleFileClick = (file: FileSystemItem) => {
    setSelectedFile(file.name);
    onFileSelect(file);
  };

  const handleFolderClick = (folderPath: string) => {
    setCurrentFolder(folderPath);
    setSelectedFile("");
  };

  const getCurrentFiles = () => {
    return fileSystemData[currentFolder] || [];
  };

  return (
    <Window
      title="Files"
      width="w-80"
      defaultPosition={{ x: 20, y: 20 }}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="p-4">
        <div className="mb-4 text-sm text-slate-400">
          <button
            onClick={() => handleFolderClick("/")}
            className="hover:text-slate-200"
          >
            root
          </button>
          {currentFolder !== "/" && (
            <>
              <span className="mx-2">/</span>
              <span className="text-slate-200">{currentFolder.slice(1)}</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          {getCurrentFiles().map((item) => (
            <button
              key={item.name}
              onClick={() =>
                item.type === "folder"
                  ? handleFolderClick(`/${item.name}`)
                  : handleFileClick(item)
              }
              className={`w-full flex items-center p-2 rounded text-left hover:bg-slate-700
                ${selectedFile === item.name ? "bg-slate-700 text-slate-200" : "text-slate-400"}`}
            >
              {item.type === "folder" ? (
                <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
              ) : (
                <File className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Window>
  );
};

export default FileExplorer;
