import { DesktopShortcut } from "../types/fileSystem";

export const desktopItems: DesktopShortcut[] = [
  {
    type: "app",
    name: "Files",
  },
  {
    type: "file",
    name: "about.txt",
    path: "/about.txt",
  },
  {
    type: "folder",
    name: "Projects",
    path: "/Projects",
  },
  {
    type: "folder",
    name: "Blog",
    path: "/Blog",
  },
];
