export interface FileSystemItem {
  name: string;
  type: "file" | "folder";
  content?: string;
}

export interface FileSystemStructure {
  [path: string]: FileSystemItem[];
}
