export interface FileSystemItem {
  type: "file" | "folder";
  name: string;
  content?: string;
}

export interface DesktopShortcut {
  type: "file" | "folder" | "app";
  name: string;
  path?: string;
}
export interface FileSystemStructure {
  [path: string]: FileSystemItem[];
}
