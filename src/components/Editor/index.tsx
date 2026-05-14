import { useRef, useEffect } from "react";
import { X, FileText } from "lucide-react";
import type { FileNode } from "../../types";

interface Props {
  file: FileNode | null;
  onContentChange: (content: string) => void;
  onClose: () => void;
}

export default function Editor({ file, onContentChange, onClose }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Keep gutter scroll in sync with textarea scroll
  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Re-focus textarea when a different file is opened
  useEffect(() => {
    if (file) {
      textareaRef.current?.focus();
    }
  }, [file?.id]);

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text-muted)] gap-3 select-none">
        <FileText size={36} className="opacity-20" />
        <p className="text-sm font-sans">Open a file to start editing</p>
        <p className="text-xs opacity-50">
          Click a file in the explorer, or right-click → Open
        </p>
      </div>
    );
  }

  const content = file.content ?? "";
  const lineCount = Math.max(content.split("\n").length, 1);

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)] overflow-hidden animate-slide-right">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[var(--border)] bg-[var(--sidebar)] px-1 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-[var(--accent)] bg-[var(--bg)] text-[var(--text)] text-xs font-mono">
          <FileText size={12} className="text-[var(--accent)] flex-shrink-0" />
          <span className="max-w-[200px] truncate">{file.name}</span>
          <button
            onClick={onClose}
            className="ml-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-100 rounded-sm hover:bg-[var(--hover)] p-px"
            aria-label="Close tab"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line number gutter */}
        <div
          ref={gutterRef}
          className={`
            overflow-hidden select-none flex-shrink-0
            border-r border-[var(--border)] bg-[var(--sidebar)]
            text-right py-4 text-[var(--text-muted)] font-mono text-xs
            opacity-50
          `}
          style={{
            minWidth: "3rem",
            paddingRight: "0.75rem",
            paddingLeft: "0.5rem",
          }}
          aria-hidden
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Content textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={`
            flex-1 resize-none outline-none border-none
            bg-transparent text-[var(--text)] font-mono text-sm
            leading-6 py-4 px-4
            caret-[var(--accent)]
            placeholder:text-[var(--text-muted)]
          `}
          placeholder="Start typing…"
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-end gap-4 px-4 py-1 border-t border-[var(--border)] bg-[var(--sidebar)] text-[9px] font-mono text-[var(--text-muted)] opacity-60 flex-shrink-0 select-none">
        <span>
          {lineCount} {lineCount === 1 ? "line" : "lines"}
        </span>
        <span>{content.length} chars</span>
      </div>
    </div>
  );
}
