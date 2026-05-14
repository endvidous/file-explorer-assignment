# File Explorer — Complete Implementation

> Storebox Frontend Take-Home · Vite + React + TypeScript + Tailwind

---

## Table of Contents

1. [Stack & Package Setup](#1-stack--package-setup)
2. [Project Configuration](#2-project-configuration)
3. [Types](#3-types)
4. [Context](#4-context)
5. [Utilities](#5-utilities)
6. [Hooks](#6-hooks)
7. [Components — Shared](#7-components--shared)
8. [Components — File Explorer](#8-components--file-explorer)
9. [Components — Editor](#9-components--editor)
10. [App Root](#10-app-root)
11. [README](#11-readme)

---

## 1. Stack & Package Setup

### `package.json`

```json
{
  "name": "file-explorer",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.383.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^7.13.0",
    "@typescript-eslint/parser": "^7.13.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.3.1"
  }
}
```

**Dependencies explained:**
- `lucide-react` — file, folder, chevron, sun/moon, X icons. Zero config, tree-shakeable.
- `uuid` — collision-proof IDs for every tree node. Never rely on name or index.
- Everything else is standard Vite + React + TS scaffolding.

---

## 2. Project Configuration

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      keyframes: {
        contextIn: {
          '0%':   { opacity: '0', transform: 'translateY(-6px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        nodeIn: {
          '0%':   { opacity: '0', transform: 'translateX(-4px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'context-in':  'contextIn 0.12s ease-out forwards',
        'node-in':     'nodeIn 0.15s ease-out forwards',
        'slide-right': 'slideRight 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
```

### `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File Explorer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 3. Types

### `src/types/index.ts`

```typescript
// ─── Tree Node ────────────────────────────────────────────────────────────────

export type NodeType = 'file' | 'folder';

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

export type Theme = 'dark' | 'light';

// ─── Drag & Drop ─────────────────────────────────────────────────────────────

export type DropPosition = 'before' | 'inside' | 'after';

export interface DragState {
  sourceId: string | null;
  overId: string | null;
  position: DropPosition | null;
}
```

---

## 4. Context

Putting all explorer state and handlers into a React Context eliminates
prop drilling through the recursive `TreeNode` tree.

### `src/context/FileExplorerContext.tsx`

```typescript
import { createContext, useContext } from 'react';
import { FileNode, ContextMenuState, DragState, DropPosition } from '../types';

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
  onCreateNode: (type: 'file' | 'folder', parentId?: string | null) => void;
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

const FileExplorerContext = createContext<FileExplorerContextValue | null>(null);

export function useFileExplorerContext(): FileExplorerContextValue {
  const ctx = useContext(FileExplorerContext);
  if (!ctx) throw new Error('useFileExplorerContext must be used inside FileExplorer');
  return ctx;
}

export default FileExplorerContext;
```

---

## 5. Utilities

Pure recursive functions. No side effects — easy to unit test in isolation.

### `src/utils/tree.ts`

```typescript
import { FileNode, DropPosition } from '../types';

// ─── Find ─────────────────────────────────────────────────────────────────────

export function findNode(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// ─── Add ──────────────────────────────────────────────────────────────────────

/**
 * Add `newNode` as a child of `parentId`.
 * If parentId is null, add at root.
 */
export function addNode(
  nodes: FileNode[],
  parentId: string | null,
  newNode: FileNode,
): FileNode[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        isOpen: true,
        children: [...(node.children ?? []), newNode],
      };
    }
    if (node.children) {
      return { ...node, children: addNode(node.children, parentId, newNode) };
    }
    return node;
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function deleteNode(nodes: FileNode[], id: string): FileNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({
      ...n,
      children: n.children ? deleteNode(n.children, id) : undefined,
    }));
}

// ─── Rename ───────────────────────────────────────────────────────────────────

export function renameNode(nodes: FileNode[], id: string, name: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, name };
    if (n.children) return { ...n, children: renameNode(n.children, id, name) };
    return n;
  });
}

// ─── Update content ───────────────────────────────────────────────────────────

export function updateContent(nodes: FileNode[], id: string, content: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, content };
    if (n.children) return { ...n, children: updateContent(n.children, id, content) };
    return n;
  });
}

// ─── Toggle folder ────────────────────────────────────────────────────────────

export function toggleFolder(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id && n.type === 'folder') return { ...n, isOpen: !n.isOpen };
    if (n.children) return { ...n, children: toggleFolder(n.children, id) };
    return n;
  });
}

export function openFolder(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id && n.type === 'folder') return { ...n, isOpen: true };
    if (n.children) return { ...n, children: openFolder(n.children, id) };
    return n;
  });
}

// ─── Drag helpers ─────────────────────────────────────────────────────────────

/**
 * Returns true if `potentialChildId` is a descendant of `ancestorId`.
 * Used to block dropping a node onto its own child.
 */
export function isDescendant(
  nodes: FileNode[],
  ancestorId: string,
  potentialChildId: string,
): boolean {
  const ancestor = findNode(nodes, ancestorId);
  if (!ancestor?.children) return false;

  const check = (children: FileNode[]): boolean => {
    for (const child of children) {
      if (child.id === potentialChildId) return true;
      if (child.children && check(child.children)) return true;
    }
    return false;
  };

  return check(ancestor.children);
}

/**
 * Move `sourceId` relative to `targetId` according to `position`.
 *
 *   'before'  → insert sourceId as sibling immediately before targetId
 *   'after'   → insert sourceId as sibling immediately after targetId
 *   'inside'  → insert sourceId as first child of targetId (folders only)
 */
export function moveNode(
  nodes: FileNode[],
  sourceId: string,
  targetId: string,
  position: DropPosition,
): FileNode[] {
  // Step 1 — extract the source node from wherever it lives
  let sourceNode: FileNode | null = null;

  const extract = (arr: FileNode[]): FileNode[] =>
    arr
      .filter((n) => {
        if (n.id === sourceId) {
          sourceNode = { ...n };
          return false;
        }
        return true;
      })
      .map((n) => ({
        ...n,
        children: n.children ? extract(n.children) : undefined,
      }));

  const withoutSource = extract(nodes);
  if (!sourceNode) return nodes; // source not found — no-op

  // Step 2 — insert the source node at the target position
  const insert = (arr: FileNode[]): FileNode[] => {
    const result: FileNode[] = [];

    for (const node of arr) {
      if (position === 'before' && node.id === targetId) {
        result.push(sourceNode!);
      }

      if (position === 'inside' && node.id === targetId && node.type === 'folder') {
        result.push({
          ...node,
          isOpen: true,
          children: [sourceNode!, ...(node.children ?? [])],
        });
      } else {
        result.push({
          ...node,
          children: node.children ? insert(node.children) : undefined,
        });
      }

      if (position === 'after' && node.id === targetId) {
        result.push(sourceNode!);
      }
    }

    return result;
  };

  return insert(withoutSource);
}
```

---

## 6. Hooks

### `src/hooks/useLocalStorage.ts`

```typescript
import { useState, useEffect } from 'react';

/**
 * Drop-in replacement for useState that syncs to localStorage.
 * Reads once on mount; writes on every change.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode — degrade silently
    }
  }, [key, value]);

  return [value, setValue];
}
```

### `src/hooks/useTheme.ts`

```typescript
import { useEffect } from 'react';
import { Theme } from '../types';
import { useLocalStorage } from './useLocalStorage';

/**
 * Returns [currentTheme, toggleTheme].
 * Adds/removes the 'dark' class on <html> so Tailwind picks it up.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>('fe-theme', 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
}
```

### `src/hooks/useFileTree.ts`

```typescript
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FileNode,
  ContextMenuState,
  DragState,
  DropPosition,
} from '../types';
import { useLocalStorage } from './useLocalStorage';
import {
  addNode,
  deleteNode,
  renameNode,
  updateContent,
  toggleFolder,
  findNode,
  moveNode,
  isDescendant,
} from '../utils/tree';

const STORAGE_KEY_TREE = 'fe-tree';
const STORAGE_KEY_FILE = 'fe-open-file';

export function useFileTree() {
  // ── Persisted ───────────────────────────────────────────────────────────────
  const [tree, setTree] = useLocalStorage<FileNode[]>(STORAGE_KEY_TREE, []);
  const [openFileId, setOpenFileId] = useLocalStorage<string | null>(STORAGE_KEY_FILE, null);

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
      return node.type === 'folder' ? hint : null;
    },
    [tree],
  );

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const onCreateNode = useCallback(
    (type: 'file' | 'folder', parentId?: string | null) => {
      // parentId can be:
      //   undefined  → caller doesn't specify; infer from selectedId
      //   null       → explicit root
      //   string     → explicit parent folder
      const effectiveParent =
        parentId !== undefined ? resolveParentId(parentId) : resolveParentId(selectedId);

      const newNode: FileNode = {
        id: uuidv4(),
        name: '',
        type,
        ...(type === 'folder' ? { children: [], isOpen: true } : { content: '' }),
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
      setContextMenu({ x: e.clientX, y: e.clientY, nodeId, nodeType: node.type });
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
      const safe =
        !isDescendant(tree, sourceId, overId) && overId !== sourceId;
      if (safe) {
        setTree((t) => moveNode(t, sourceId, overId, position));
      }
    }
    setDragState({ sourceId: null, overId: null, position: null });
  }, [dragState, tree, setTree]);

  const onCancelDrag = useCallback(() => {
    setDragState({ sourceId: null, overId: null, position: null });
  }, []);

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
  };
}
```

---

## 7. Components — Shared

### `src/components/ThemeToggle.tsx`

```tsx
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types';

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`
        relative w-8 h-8 flex items-center justify-center rounded-md
        transition-all duration-200 active:scale-90
        text-[var(--text-muted)] hover:text-[var(--text)]
        hover:bg-[var(--hover)]
      `}
    >
      {/* Sun and moon swap with a rotate-and-fade */}
      <span
        className={`absolute transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
        }`}
      >
        <Sun size={15} />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
        }`}
      >
        <Moon size={15} />
      </span>
    </button>
  );
}
```

---

## 8. Components — File Explorer

### `src/components/FileExplorer/InlineInput.tsx`

Mounts with focus. `Enter` confirms, `Escape` cancels, `blur` confirms.

```tsx
import { useEffect, useRef, useState } from 'react';

interface Props {
  initialValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InlineInput({ initialValue, onConfirm, onCancel }: Props) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm(value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onConfirm(value)}
      onClick={(e) => e.stopPropagation()}
      className={`
        flex-1 min-w-0 bg-transparent border border-[var(--accent)]
        outline-none rounded-sm px-1 py-px
        text-sm font-mono text-[var(--text)]
        caret-[var(--accent)]
      `}
    />
  );
}
```

### `src/components/FileExplorer/ContextMenu.tsx`

The right-click floating menu. Closes on outside click or Escape.

```tsx
import { useEffect, useRef } from 'react';
import {
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { ContextMenuState } from '../../types';
import { useFileExplorerContext } from '../../context/FileExplorerContext';

interface Props {
  menu: ContextMenuState;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
  dividerBefore?: boolean;
}

export default function ContextMenu({ menu }: Props) {
  const {
    onCreateNode,
    onStartRename,
    onDeleteNode,
    onOpenFile,
    onHideContextMenu,
  } = useFileExplorerContext();

  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onHideContextMenu();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onHideContextMenu();
    };
    window.addEventListener('mousedown', handler);
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [onHideContextMenu]);

  // Adjust position so menu doesn't overflow viewport
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    left: Math.min(menu.x, window.innerWidth - 180),
    top: Math.min(menu.y, window.innerHeight - 200),
  };

  const folderItems: MenuItem[] = [
    {
      label: 'New File',
      icon: <FilePlus size={13} />,
      action: () => { onCreateNode('file', menu.nodeId); onHideContextMenu(); },
    },
    {
      label: 'New Folder',
      icon: <FolderPlus size={13} />,
      action: () => { onCreateNode('folder', menu.nodeId); onHideContextMenu(); },
    },
    {
      label: 'Rename',
      icon: <Pencil size={13} />,
      action: () => { onStartRename(menu.nodeId); onHideContextMenu(); },
      dividerBefore: true,
    },
    {
      label: 'Delete',
      icon: <Trash2 size={13} />,
      action: () => { onDeleteNode(menu.nodeId); },
      danger: true,
    },
  ];

  const fileItems: MenuItem[] = [
    {
      label: 'Open',
      icon: <FolderOpen size={13} />,
      action: () => { onOpenFile(menu.nodeId); },
    },
    {
      label: 'Rename',
      icon: <Pencil size={13} />,
      action: () => { onStartRename(menu.nodeId); onHideContextMenu(); },
    },
    {
      label: 'Delete',
      icon: <Trash2 size={13} />,
      action: () => { onDeleteNode(menu.nodeId); },
      danger: true,
    },
  ];

  const items = menu.nodeType === 'folder' ? folderItems : fileItems;

  return (
    <div
      ref={menuRef}
      style={style}
      className="animate-context-in min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--sidebar)] shadow-2xl py-1 overflow-hidden"
    >
      {items.map((item, i) => (
        <div key={i}>
          {item.dividerBefore && (
            <div className="my-1 border-t border-[var(--border)]" />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); item.action(); }}
            className={`
              w-full flex items-center gap-2.5 px-3 py-1.5 text-sm
              transition-colors duration-100
              ${
                item.danger
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-[var(--text)] hover:bg-[var(--hover)]'
              }
            `}
          >
            <span className="opacity-60">{item.icon}</span>
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### `src/components/FileExplorer/TreeNode.tsx`

The core recursive component. Handles render, expand/collapse, rename,
Rename/Delete hover buttons, right-click context menu, and drag & drop.

```tsx
import { useRef } from 'react';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { FileNode, DropPosition } from '../../types';
import { useFileExplorerContext } from '../../context/FileExplorerContext';
import InlineInput from './InlineInput';

interface Props {
  node: FileNode;
  depth: number;
}

export default function TreeNode({ node, depth }: Props) {
  const {
    selectedId,
    openFileId,
    renamingId,
    dragState,
    onSelect,
    onOpenFile,
    onToggleFolder,
    onShowContextMenu,
    onConfirmRename,
    onCancelRename,
    onStartRename,
    onDeleteNode,
    onStartDrag,
    onDragOver,
    onDrop,
    onCancelDrag,
  } = useFileExplorerContext();

  const rowRef = useRef<HTMLDivElement>(null);

  const isSelected  = selectedId === node.id;
  const isOpenFile  = openFileId === node.id;
  const isExpanded  = node.type === 'folder' && !!node.isOpen;
  const isRenaming  = renamingId === node.id;
  const isDragging  = dragState.sourceId === node.id;
  const isOver      = dragState.overId === node.id;
  const dropPos     = isOver ? dragState.position : null;

  // ── Interaction ─────────────────────────────────────────────────────────────

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    if (node.type === 'folder') onToggleFolder(node.id);
    else onOpenFile(node.id);
  };

  // ── Drag ────────────────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    // Slight delay so the drag ghost renders first
    setTimeout(() => onStartDrag(node.id), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rowRef.current || dragState.sourceId === node.id) return;

    const rect = rowRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const h    = rect.height;

    let position: DropPosition;
    if (node.type === 'folder') {
      if (relY < h * 0.25)      position = 'before';
      else if (relY > h * 0.75) position = 'after';
      else                       position = 'inside';
    } else {
      position = relY < h / 2 ? 'before' : 'after';
    }

    onDragOver(node.id, position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving this node (not entering a child)
    if (!rowRef.current?.contains(e.relatedTarget as Node)) {
      onDragOver(node.id, dragState.position ?? 'after'); // keep last position
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop();
  };

  const handleDragEnd = () => {
    onCancelDrag();
  };

  // ── Appearance ──────────────────────────────────────────────────────────────

  const rowBase = `
    group relative flex items-center gap-1.5 py-[3px] pr-2 cursor-pointer select-none
    text-sm font-mono rounded-sm
    transition-colors duration-100
  `;

  const rowColor = isSelected
    ? 'bg-[var(--selected)] text-[var(--text)] border-l-2 border-[var(--accent)]'
    : 'text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)] border-l-2 border-transparent';

  const rowDrag = isDragging ? 'opacity-40' : 'opacity-100';

  const rowInside =
    dropPos === 'inside'
      ? 'ring-1 ring-inset ring-[var(--accent)] rounded-sm'
      : '';

  const indentPx = depth * 12 + 8;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-node-in">
      {/* Drop indicator — BEFORE */}
      {dropPos === 'before' && (
        <div
          className="h-px mx-2 rounded-full bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]"
          style={{ marginLeft: indentPx }}
        />
      )}

      {/* Node row */}
      <div
        ref={rowRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onContextMenu={(e) => onShowContextMenu(e, node.id)}
        onClick={handleClick}
        style={{ paddingLeft: `${indentPx}px` }}
        className={`${rowBase} ${rowColor} ${rowDrag} ${rowInside}`}
      >
        {/* Chevron (folders) or spacer (files) */}
        {node.type === 'folder' ? (
          <ChevronRight
            size={13}
            className={`flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        {/* Icon */}
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen size={14} className="flex-shrink-0 text-amber-400" />
          ) : (
            <Folder size={14} className="flex-shrink-0 text-amber-400 dark:text-amber-300" />
          )
        ) : (
          <FileText
            size={13}
            className={`flex-shrink-0 ${
              isOpenFile ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
            }`}
          />
        )}

        {/* Name / Inline input */}
        {isRenaming ? (
          <InlineInput
            initialValue={node.name}
            onConfirm={onConfirmRename}
            onCancel={onCancelRename}
          />
        ) : (
          <span
            className={`flex-1 truncate leading-relaxed ${
              isOpenFile ? 'text-[var(--text)]' : ''
            }`}
          >
            {node.name || <span className="opacity-40 italic">untitled</span>}
          </span>
        )}

        {/* Hover action buttons */}
        {!isRenaming && (
          <div className="absolute right-1 hidden group-hover:flex items-center gap-0.5">
            <button
              title="Rename"
              onClick={(e) => {
                e.stopPropagation();
                onStartRename(node.id);
              }}
              className={`
                p-1 rounded text-[var(--text-muted)] opacity-0 group-hover:opacity-100
                hover:text-[var(--text)] hover:bg-[var(--hover-strong)]
                transition-all duration-100
              `}
            >
              <Pencil size={11} />
            </button>
            <button
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className={`
                p-1 rounded text-red-400 opacity-0 group-hover:opacity-100
                hover:bg-red-500/15 transition-all duration-100
              `}
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Drop indicator — AFTER */}
      {dropPos === 'after' && (
        <div
          className="h-px mx-2 rounded-full bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]"
          style={{ marginLeft: indentPx }}
        />
      )}

      {/* Children — animated expand/collapse */}
      {node.type === 'folder' && node.children && (
        <div
          className={`tree-children ${isExpanded ? 'open' : ''}`}
          // Prevents drop events bubbling past the children wrapper
          onDragOver={(e) => e.stopPropagation()}
        >
          <div className="tree-children-inner">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### `src/components/FileExplorer/TreeView.tsx`

Renders the flat root-level list. Also acts as a drop target for the
tree background (dropping here moves a node to root).

```tsx
import { FileNode } from '../../types';
import { useFileExplorerContext } from '../../context/FileExplorerContext';
import TreeNode from './TreeNode';

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
```

### `src/components/FileExplorer/Toolbar.tsx`

The two root action buttons. Animates on press with `active:scale-95`.

```tsx
import { FilePlus, FolderPlus } from 'lucide-react';
import { useFileExplorerContext } from '../../context/FileExplorerContext';

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
        onClick={() => onCreateNode('file')}
        className={`${btnBase} bg-[var(--hover)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
      >
        <FilePlus size={13} />
        New File
      </button>

      <button
        onClick={() => onCreateNode('folder')}
        className={`${btnBase} bg-[var(--hover)] text-[var(--text)] hover:border-amber-400 hover:text-amber-400`}
      >
        <FolderPlus size={13} />
        New Folder
      </button>
    </div>
  );
}
```

### `src/components/FileExplorer/index.tsx`

Wires everything together, provides context, and renders the context menu.

```tsx
import { useEffect } from 'react';
import FileExplorerContext, { FileExplorerContextValue } from '../../context/FileExplorerContext';
import Toolbar from './Toolbar';
import TreeView from './TreeView';
import ContextMenu from './ContextMenu';

interface Props extends FileExplorerContextValue {}

export default function FileExplorer(props: Props) {
  // Close context menu on Escape globally
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onHideContextMenu();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [props.onHideContextMenu]);

  return (
    <FileExplorerContext.Provider value={props}>
      <div
        className="flex flex-col h-full bg-[var(--sidebar)] border-r border-[var(--border)] w-64 flex-shrink-0 overflow-hidden"
        // Clicking the panel background deselects context menu
        onClick={props.onHideContextMenu}
      >
        {/* Panel header */}
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-[var(--text-muted)] opacity-60 select-none">
            Explorer
          </span>
        </div>

        <Toolbar />
        <TreeView tree={props.tree} />
      </div>

      {/* Context menu — rendered outside the panel so it can overflow */}
      {props.contextMenu && <ContextMenu menu={props.contextMenu} />}
    </FileExplorerContext.Provider>
  );
}
```

---

## 9. Components — Editor

### `src/components/Editor/index.tsx`

Line-number gutter + textarea. Gutter scrolls in sync with the textarea.

```tsx
import { useRef, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { FileNode } from '../../types';

interface Props {
  file: FileNode | null;
  onContentChange: (content: string) => void;
  onClose: () => void;
}

export default function Editor({ file, onContentChange, onClose }: Props) {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const gutterRef    = useRef<HTMLDivElement>(null);

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
        <p className="text-xs opacity-50">Click a file in the explorer, or right-click → Open</p>
      </div>
    );
  }

  const content   = file.content ?? '';
  const lineCount = Math.max(content.split('\n').length, 1);

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
          style={{ minWidth: '3rem', paddingRight: '0.75rem', paddingLeft: '0.5rem' }}
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
        <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
        <span>{content.length} chars</span>
      </div>
    </div>
  );
}
```

---

## 10. App Root

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
/* Loaded in index.html via <link> for optimal performance */

/* ── CSS Variables — Light theme (default) ────────────────────────────────── */
:root {
  --bg:           #f6f8fa;
  --sidebar:      #ffffff;
  --hover:        #eef1f5;
  --hover-strong: #e2e7ed;
  --selected:     #dbeafe;
  --border:       #d0d7de;
  --text:         #1f2328;
  --text-muted:   #656d76;
  --accent:       #0969da;
}

/* ── CSS Variables — Dark theme ───────────────────────────────────────────── */
.dark {
  --bg:           #0d1117;
  --sidebar:      #161b22;
  --hover:        #1c2128;
  --hover-strong: #21262d;
  --selected:     #1a2d46;
  --border:       #30363d;
  --text:         #e6edf3;
  --text-muted:   #8b949e;
  --accent:       #58a6ff;
}

/* ── Base resets ──────────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'IBM Plex Sans', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  /* Smooth colour transitions when theme toggles */
  transition: background-color 0.25s ease, color 0.2s ease;
}

/* ── Folder expand/collapse animation ─────────────────────────────────────── */
/*
  Uses the grid-template-rows trick for accurate height animation.
  Collapsing from auto-height is smooth because we're interpolating
  1fr → 0fr instead of max-height: 9999px → 0.
*/
.tree-children {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.2s ease-in-out,
    opacity 0.15s ease;
}

.tree-children.open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.tree-children-inner {
  overflow: hidden;
}

/* ── Thin scrollbar ──────────────────────────────────────────────────────── */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border-radius: 2px;
}

/* ── Keyframes (also declared in tailwind.config.js for className usage) ─── */
@keyframes contextIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

@keyframes nodeIn {
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0);    }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0);    }
}
```

### `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### `src/App.tsx`

```tsx
import { useMemo } from 'react';
import { useTheme } from './hooks/useTheme';
import { useFileTree } from './hooks/useFileTree';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import ThemeToggle from './components/ThemeToggle';
import { findNode } from './utils/tree';
import { FileExplorerContextValue } from './context/FileExplorerContext';

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
      tree:          ft.tree,
      selectedId:    ft.selectedId,
      openFileId:    ft.openFileId,
      renamingId:    ft.renamingId,
      renamingIsNew: ft.renamingIsNew,
      contextMenu:   ft.contextMenu,
      dragState:     ft.dragState,
      onSelect:           ft.onSelect,
      onOpenFile:         ft.onOpenFile,
      onToggleFolder:     ft.onToggleFolder,
      onCreateNode:       ft.onCreateNode,
      onConfirmRename:    ft.onConfirmRename,
      onCancelRename:     ft.onCancelRename,
      onStartRename:      ft.onStartRename,
      onDeleteNode:       ft.onDeleteNode,
      onUpdateContent:    ft.onUpdateContent,
      onShowContextMenu:  ft.onShowContextMenu,
      onHideContextMenu:  ft.onHideContextMenu,
      onStartDrag:        ft.onStartDrag,
      onDragOver:         ft.onDragOver,
      onDrop:             ft.onDrop,
      onCancelDrag:       ft.onCancelDrag,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onClose={() => ft.onOpenFile('')}
        />
      </div>
    </div>
  );
}
```

> **Note on `onClose`:** passing an empty string to `onOpenFile` won't
> find a node, which causes `openFile` to be `null` → editor shows empty
> state. A cleaner approach is to expose a dedicated `onCloseFile` action
> in `useFileTree`:
>
> ```typescript
> // In useFileTree.ts — add this handler:
> const onCloseFile = useCallback(() => setOpenFileId(null), [setOpenFileId]);
> ```
>
> Then update `App.tsx` to pass `onClose={ft.onCloseFile}` to `<Editor>`.
> This is the recommended approach for production.

---

## 11. README

### `README.md`

````markdown
# File Explorer

VS Code-style file explorer built for the Storebox Frontend Engineer assignment.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling + CSS variables for theming
- **lucide-react** — icons
- **uuid** — node ID generation

## Features

- Create / rename / delete files and folders
- Nested folders (unlimited depth)
- Click a file to open it in an inline text editor with line numbers
- Right-click any node for a context menu
- Keyboard: `Enter` to confirm rename, `Escape` to cancel
- Drag-and-drop to reorder and nest nodes
- Dark / light theme toggle (persisted)
- Full state persistence via `localStorage`
- Folder expand / collapse with smooth CSS animation

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

Requires **Node.js ≥ 18**.

## Project Structure

```
src/
├── types/          — shared TypeScript interfaces
├── context/        — React context for the file explorer panel
├── utils/          — pure tree-manipulation functions
├── hooks/          — useLocalStorage, useTheme, useFileTree
└── components/
    ├── FileExplorer/
    │   ├── index.tsx       — context provider + layout
    │   ├── Toolbar.tsx     — New File / New Folder buttons
    │   ├── TreeView.tsx    — root list renderer + drop target
    │   ├── TreeNode.tsx    — recursive node (file & folder)
    │   ├── ContextMenu.tsx — right-click menu
    │   └── InlineInput.tsx — inline rename input
    ├── Editor/
    │   └── index.tsx       — text editor with line numbers
    └── ThemeToggle.tsx     — sun / moon button
```

## Drag & Drop

- **Drag** any file or folder to move it.
- **Drop above** a node to insert before it.
- **Drop below** a node to insert after it.
- **Drop in the middle** of a folder to move inside it.
- A glowing blue line shows the exact drop target.
- Dropping a folder onto its own descendant is blocked.

## LLM Usage

See `chat-history.md` for the full conversation used to build this project.
````

---

## Appendix — Key Design Decisions

### Why Context instead of prop drilling?

`TreeNode` is recursive. Without context, every prop would need to be
passed `N` levels deep through the tree. With `FileExplorerContext`, each
`TreeNode` calls `useFileExplorerContext()` and gets exactly what it
needs. The context value is memoised in `App.tsx` so it doesn't re-render
every child on every keystroke.

### Why `grid-template-rows` for folder animation?

The classic `max-height` trick has a flaw: transitioning from `0` to
`9999px` means the animation duration covers a 9999px range, making
expansions feel instant. `grid-template-rows: 0fr → 1fr` accurately
interpolates the actual content height, giving a smooth and natural feel
in both directions.

### Why pure functions in `utils/tree.ts`?

Every tree operation (add, delete, rename, move) returns a new array
without mutating the original. This is compatible with React's `setState`
functional updates, makes the code easy to reason about, and trivially
supports undo/redo if added later.

### Why `useLocalStorage` over Zustand/Redux?

The state shape is simple: one tree array. A lightweight custom hook that
wraps `useState` + `useEffect` is the smallest possible solution. Zero
additional bundle size, zero learning curve.

### Drag & Drop without a library

HTML5 native drag-and-drop (`draggable`, `onDragStart`, `onDragOver`,
`onDrop`) handles everything the spec requires. The drop position
(`before` / `inside` / `after`) is calculated from the mouse Y coordinate
relative to the target row's bounding rectangle. Assignments explicitly
prohibit tree libraries, and the native API is sufficient.
