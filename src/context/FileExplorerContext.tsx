import { createContext, useContext } from "react";
import type {
  FileNode,
  ContextMenuState,
  DragState,
  DropPosition,
} from "../types";

export interface FileExplorerContextValue {
  // ── State ────────────────────────────────────────────
  tree: FileNode[];
  selectedId: string | null;
  openFileId: string | null;
  renamingId: string | null;
  renamingIsNew: boolean;
  contextMenu: ContextMenuState | null;
  dragState: DragState;

  // ── Selection / Navigation ───────────────────────────
  onSelect: (id: string) => void;
  onOpenFile: (id: string) => void;
  onToggleFolder: (id: string) => void;

  // ── CRUD ─────────────────────────────────────────────
  onCreateNode: (type: "file" | "folder", parentId?: string | null) => void;
  onConfirmRename: (name: string) => void;
  onCancelRename: () => void;
  onStartRename: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateContent: (id: string, content: string) => void;

  // ── Context Menu ─────────────────────────────────────
  onShowContextMenu: (e: React.MouseEvent, id: string) => void;
  onHideContextMenu: () => void;

  // ── Drag & Drop ───────────────────────────────────────
  onStartDrag: (id: string) => void;
  onDragOver: (id: string, position: DropPosition) => void;
  onDrop: () => void;
  onCancelDrag: () => void;
}

const FileExplorerContext = createContext<FileExplorerContextValue | null>(
  null,
);

export function useFileExplorerContext(): FileExplorerContextValue {
  const ctx = useContext(FileExplorerContext);
  if (!ctx)
    throw new Error("useFileExplorerContext must be used inside FileExplorer");
  return ctx;
}

export default FileExplorerContext;
