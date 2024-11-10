import { useRef } from "react";
import { WindowManager, WindowManagerRef } from "../WindowManager";
import { DesktopIcon } from "../DesktopIcon";
import { FileSystemItem, DesktopShortcut } from "../../types/fileSystem";
import { fileSystemData } from "../../data/fileSystem";
import { desktopItems } from "../../data/desktopItems";

export default function Desktop() {
  const windowManagerRef = useRef<WindowManagerRef>(null);

  const handleFileSelect = async (file: FileSystemItem) => {
    windowManagerRef.current?.handleFileSelect(file);
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
            windowManagerRef.current?.handleFileSelect(file);
          }
        }
        break;

      case "app":
        if (item.name === "Files") {
          windowManagerRef.current?.navigateToFolder("/");
        }
        break;

      case "folder":
        if (item.path) {
          const pathParts = item.path.split("/").filter((part) => part);
          if (pathParts.length > 0) {
            const parentPath =
              pathParts.length > 1
                ? `/${pathParts.slice(0, -1).join("/")}`
                : "/";
            const selectedFolder = pathParts[pathParts.length - 1];
            windowManagerRef.current?.navigateToFolder(
              parentPath,
              selectedFolder,
            );
          }
        }
        break;
    }
  };

  return (
    <div className="relative w-full h-full bg-[#B3B3B3] p-4">
      <WindowManager ref={windowManagerRef} onFileSelect={handleFileSelect}>
        <div className="flex flex-col items-start gap-4">
          {desktopItems.map((item) => (
            <DesktopIcon
              key={item.name}
              item={item}
              onClick={handleDesktopItemClick}
            />
          ))}
        </div>
      </WindowManager>
    </div>
  );
}
