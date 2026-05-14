import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  FileNode,
  ContextMenuState,
  DragState,
  DropPosition,
} from "../types";
import { useLocalStorage } from "./useLocalStorage";
import {
  addNode,
  deleteNode,
  renameNode,
  updateContent,
  toggleFolder,
  findNode,
  moveNode,
  isDescendant,
} from "../utils/tree";

const STORAGE_KEY_TREE = "fe-tree";
const STORAGE_KEY_FILE = "fe-open-file";

export function useFileTree() {
  // ── Persisted ───────────────────────────────────────────────────────────────
  const [tree, setTree] = useLocalStorage<FileNode[]>(STORAGE_KEY_TREE, []);
  const [openFileId, setOpenFileId] = useLocalStorage<string | null>(
    STORAGE_KEY_FILE,
    null,
  );

  // ── Ephemeral UI state ───────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingIsNew, setRenamingIsNew] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    sourceId: null,
    overId: null,
    position: null,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * Given a node ID that might be a file, returns its parent folder ID (or null
   * if the node IS a folder, or if the node is at root).
   * We use this so toolbar buttons create inside the focused folder.
   */
  const resolveParentId = useCallback(
    (hint: string | null | undefined): string | null => {
      if (hint == null) return null;
      const node = findNode(tree, hint);
      if (!node) return null;
      return node.type === "folder" ? hint : null;
    },
    [tree],
  );

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const onCreateNode = useCallback(
    (type: "file" | "folder", parentId?: string | null) => {
      // parentId can be:
      //   undefined  → caller doesn't specify; infer from selectedId
      //   null       → explicit root
      //   string     → explicit parent folder
      const effectiveParent =
        parentId !== undefined
          ? resolveParentId(parentId)
          : resolveParentId(selectedId);

      const newNode: FileNode = {
        id: uuidv4(),
        name: "",
        type,
        ...(type === "folder"
          ? { children: [], isOpen: true }
          : { content: "" }),
      };

      setTree((t) => addNode(t, effectiveParent, newNode));
      setRenamingId(newNode.id);
      setRenamingIsNew(true);
      setContextMenu(null);
    },
    [selectedId, resolveParentId, setTree],
  );

  const onConfirmRename = useCallback(
    (name: string) => {
      if (!renamingId) return;
      const trimmed = name.trim();
      if (!trimmed) {
        // Empty name — delete node if it was brand new
        if (renamingIsNew) setTree((t) => deleteNode(t, renamingId));
      } else {
        setTree((t) => renameNode(t, renamingId, trimmed));
      }
      setRenamingId(null);
      setRenamingIsNew(false);
    },
    [renamingId, renamingIsNew, setTree],
  );

  const onCancelRename = useCallback(() => {
    if (renamingIsNew && renamingId) {
      setTree((t) => deleteNode(t, renamingId));
    }
    setRenamingId(null);
    setRenamingIsNew(false);
  }, [renamingIsNew, renamingId, setTree]);

  const onStartRename = useCallback((id: string) => {
    setRenamingId(id);
    setRenamingIsNew(false);
    setContextMenu(null);
  }, []);

  const onDeleteNode = useCallback(
    (id: string) => {
      setTree((t) => deleteNode(t, id));
      if (openFileId === id) setOpenFileId(null);
      if (selectedId === id) setSelectedId(null);
      setContextMenu(null);
    },
    [openFileId, selectedId, setOpenFileId, setTree],
  );

  const onUpdateContent = useCallback(
    (id: string, content: string) => {
      setTree((t) => updateContent(t, id, content));
    },
    [setTree],
  );

  // ── Navigation ───────────────────────────────────────────────────────────────

  const onSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const onOpenFile = useCallback(
    (id: string) => {
      setOpenFileId(id);
      setSelectedId(id);
      setContextMenu(null);
    },
    [setOpenFileId],
  );

  const onToggleFolder = useCallback(
    (id: string) => {
      setTree((t) => toggleFolder(t, id));
    },
    [setTree],
  );

  // ── Context menu ─────────────────────────────────────────────────────────────

  const onShowContextMenu = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const node = findNode(tree, nodeId);
      if (!node) return;
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        nodeId,
        nodeType: node.type,
      });
      setSelectedId(nodeId);
    },
    [tree],
  );

  const onHideContextMenu = useCallback(() => setContextMenu(null), []);

  // ── Drag & Drop ──────────────────────────────────────────────────────────────

  const onStartDrag = useCallback((id: string) => {
    setDragState({ sourceId: id, overId: null, position: null });
  }, []);

  const onDragOver = useCallback((overId: string, position: DropPosition) => {
    setDragState((prev) => ({ ...prev, overId, position }));
  }, []);

  const onDrop = useCallback(() => {
    const { sourceId, overId, position } = dragState;
    if (sourceId && overId && position && sourceId !== overId) {
      const safe = !isDescendant(tree, sourceId, overId) && overId !== sourceId;
      if (safe) {
        setTree((t) => moveNode(t, sourceId, overId, position));
      }
    }
    setDragState({ sourceId: null, overId: null, position: null });
  }, [dragState, tree, setTree]);

  const onCancelDrag = useCallback(() => {
    setDragState({ sourceId: null, overId: null, position: null });
  }, []);

  const onCloseFile = useCallback(() => {
    setOpenFileId(null);
  }, [setOpenFileId]);

  // ── Return ───────────────────────────────────────────────────────────────────

  return {
    // state
    tree,
    selectedId,
    openFileId,
    renamingId,
    renamingIsNew,
    contextMenu,
    dragState,
    // handlers
    onSelect,
    onOpenFile,
    onToggleFolder,
    onCreateNode,
    onConfirmRename,
    onCancelRename,
    onStartRename,
    onDeleteNode,
    onUpdateContent,
    onShowContextMenu,
    onHideContextMenu,
    onStartDrag,
    onDragOver,
    onDrop,
    onCancelDrag,
    onCloseFile,
  };
}
