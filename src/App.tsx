import { useMemo } from "react";
import { useTheme } from "./hooks/useTheme";
import { useFileTree } from "./hooks/useFileTree";
import FileExplorer from "./components/FileExplorer";
import Editor from "./components/Editor";
import ThemeToggle from "./components/ThemeToggle";
import { findNode } from "./utils/tree";
import type { FileExplorerContextValue } from "./context/FileExplorerContext";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const ft = useFileTree();

  // Derive the currently open file from the tree
  const openFile = useMemo(
    () => (ft.openFileId ? findNode(ft.tree, ft.openFileId) : null),
    [ft.tree, ft.openFileId],
  );

  // Bundle context value (memoised to avoid unnecessary re-renders)
  const explorerCtx: FileExplorerContextValue = useMemo(
    () => ({
      tree: ft.tree,
      selectedId: ft.selectedId,
      openFileId: ft.openFileId,
      renamingId: ft.renamingId,
      renamingIsNew: ft.renamingIsNew,
      contextMenu: ft.contextMenu,
      dragState: ft.dragState,
      onSelect: ft.onSelect,
      onOpenFile: ft.onOpenFile,
      onToggleFolder: ft.onToggleFolder,
      onCreateNode: ft.onCreateNode,
      onConfirmRename: ft.onConfirmRename,
      onCancelRename: ft.onCancelRename,
      onStartRename: ft.onStartRename,
      onDeleteNode: ft.onDeleteNode,
      onUpdateContent: ft.onUpdateContent,
      onShowContextMenu: ft.onShowContextMenu,
      onHideContextMenu: ft.onHideContextMenu,
      onStartDrag: ft.onStartDrag,
      onDragOver: ft.onDragOver,
      onDrop: ft.onDrop,
      onCancelDrag: ft.onCancelDrag,
    }),
    [ft],
  );

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 h-10 border-b border-[var(--border)] bg-[var(--sidebar)] flex-shrink-0">
        <span className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase select-none">
          File Explorer
        </span>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer {...explorerCtx} />
        <Editor
          file={openFile ?? null}
          onContentChange={(content) => {
            if (ft.openFileId) ft.onUpdateContent(ft.openFileId, content);
          }}
          onClose={ft.onCloseFile}
        />
      </div>
    </div>
  );
}
