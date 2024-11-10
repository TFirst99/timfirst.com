export function findFileByPath(path: string) {
  const pathParts = path.split("/").filter(Boolean);
  const parentPath =
    pathParts.length > 1 ? `/${pathParts.slice(0, -1).join("/")}` : "/";
  const fileName = pathParts[pathParts.length - 1];

  return fileSystemData[parentPath]?.find((f) => f.name === fileName);
}
