// ─── Tree Node ────────────────────────────────────────────────────────────────

export type NodeType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  /** Folders only */
  children?: FileNode[];
  /** Files only */
  content?: string;
  /** Whether this folder is expanded */
  isOpen?: boolean;
}

// ─── Context Menu ────────────────────────────────────────────────────────────

export interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  nodeType: NodeType;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = "dark" | "light";

// ─── Drag & Drop ─────────────────────────────────────────────────────────────

export type DropPosition = "before" | "inside" | "after";

export interface DragState {
  sourceId: string | null;
  overId: string | null;
  position: DropPosition | null;
}
