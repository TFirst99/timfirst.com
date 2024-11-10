import { File, Folder, LayoutGrid as App } from "lucide-react";
import { DesktopShortcut } from "../../types/fileSystem";

interface DesktopIconProps {
  item: DesktopShortcut;
  onClick: (item: DesktopShortcut) => void;
}

export function DesktopIcon({ item, onClick }: DesktopIconProps) {
  const getIcon = () => {
    switch (item.type) {
      case "folder":
        return <Folder className="w-12 h-12 text-slate-300 mb-1" />;
      case "app":
        return <App className="w-12 h-12 text-slate-300 mb-1" />;
      default:
        return <File className="w-12 h-12 text-slate-300 mb-1" />;
    }
  };

  return (
    <button
      onClick={() => onClick(item)}
      className="w-24 flex flex-col items-center p-2 rounded hover:bg-slate-800/50 text-center group"
    >
      {getIcon()}
      <span className="text-sm text-slate-300 break-words w-full group-hover:text-slate-100">
        {item.name}
      </span>
    </button>
  );
}
