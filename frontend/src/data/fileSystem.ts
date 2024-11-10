import { FileSystemStructure } from "../types/fileSystem";

export const fileSystemData: FileSystemStructure = {
  "/": [
    {
      type: "file",
      name: "about.txt",
      content: "# TIMFIRST.COM\n\nWelcome to my Website.",
    },
    {
      type: "folder",
      name: "Projects",
    },
    {
      type: "folder",
      name: "Blog",
    },
  ],
  "/Projects": [
    {
      type: "file",
      name: "Personal_Site.txt",
      content:
        "# Personal Website\n\n I created **this** website to learn Javascript and web development.",
    },
    {
      type: "file",
      name: "Polling_Model.txt",
      content:
        "# Polling Model\n\nThis is a simple polling average model written in python.",
    },
  ],
  "/Blog": [
    {
      type: "file",
      name: "First_Blog_Post.txt",
      content: "# First Blog\n ### 11-9-2024 \n blog test 1",
    },
    {
      type: "file",
      name: "Markdown_Test.txt",
      content:
        "# Markdown Test\n ### 11-9-2024 \n **bold** *italic* ***bold italic***",
    },
  ],
};
