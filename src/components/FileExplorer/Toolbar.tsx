import { FilePlus, FolderPlus } from "lucide-react";
import { useFileExplorerContext } from "../../context/FileExplorerContext";

export default function Toolbar() {
  const { onCreateNode } = useFileExplorerContext();

  const btnBase = `
    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium
    border border-[var(--border)]
    transition-all duration-150 active:scale-95
    select-none cursor-pointer
  `;

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)]">
      <button
        onClick={() => onCreateNode("file")}
        className={`${btnBase} bg-[var(--hover)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
      >
        <FilePlus size={13} />
        New File
      </button>

      <button
        onClick={() => onCreateNode("folder")}
        className={`${btnBase} bg-[var(--hover)] text-[var(--text)] hover:border-amber-400 hover:text-amber-400`}
      >
        <FolderPlus size={13} />
        New Folder
      </button>
    </div>
  );
}
