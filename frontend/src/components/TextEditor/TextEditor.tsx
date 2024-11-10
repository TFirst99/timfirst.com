import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Window } from "../Window";
import { Loader } from "lucide-react";

interface TextEditorProps {
  content: string;
  fileName: string;
  isLoading: boolean;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
}

export function TextEditor({
  content,
  fileName,
  isLoading,
  zIndex,
  onFocus,
  onClose,
}: TextEditorProps) {
  return (
    <Window
      title={fileName || "Untitled - Notepad"}
      defaultPosition={{ x: 800, y: 20 }}
      width="w-[600px]"
      zIndex={zIndex}
      onFocus={onFocus}
      onClose={onClose}
    >
      <div className="h-full bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : content ? (
          <div className="font-mono text-sm p-2 text-black">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="whitespace-pre-wrap"
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="p-2 text-gray-600">
            Select a file to view its contents
          </p>
        )}
      </div>
    </Window>
  );
}
