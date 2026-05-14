import type { FileNode } from "../../types";
import { useFileExplorerContext } from "../../context/FileExplorerContext";
import TreeNode from "./TreeNode";

interface Props {
  tree: FileNode[];
}

export default function TreeView({ tree }: Props) {
  const { dragState, onDrop, onCancelDrag } = useFileExplorerContext();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop on background
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // If drag ended without hitting a specific node — no-op
    // (the node's own onDrop handles the move)
    if (!dragState.overId) onCancelDrag();
    else onDrop();
  };

  return (
    <div
      className="flex-1 overflow-y-auto py-1 scrollbar-thin"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {tree.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-[var(--text-muted)] text-xs gap-2 opacity-60">
          <p>No files yet.</p>
          <p>Use the buttons above to get started.</p>
        </div>
      ) : (
        tree.map((node) => <TreeNode key={node.id} node={node} depth={0} />)
      )}
    </div>
  );
}
