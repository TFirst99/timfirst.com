import { FileSystemStructure } from "../types/fileSystem";

export const fileSystemData: FileSystemStructure = {
  "/": [
    {
      name: "about.txt",
      type: "file",
      content: "Welcome to my personal start page!",
    },
    {
      name: "Projects",
      type: "folder",
    },
    {
      name: "Blog",
      type: "folder",
    },
  ],
  "/Projects": [
    {
      name: "project1.md",
      type: "file",
      content: "# Project 1\n\nThis is my first project...",
    },
    {
      name: "project2.md",
      type: "file",
      content: "# Project 2\n\nThis is my second project...",
    },
  ],
  "/Blog": [
    {
      name: "post1.md",
      type: "file",
      content: "# First Blog Post\n\nWelcome to my blog...",
    },
    {
      name: "post2.md",
      type: "file",
      content: "# Second Blog Post\n\nMore interesting content...",
    },
  ],
};
