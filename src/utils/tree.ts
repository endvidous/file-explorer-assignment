import type { FileNode, DropPosition } from "../types";

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
    if (node.id === parentId && node.type === "folder") {
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

export function renameNode(
  nodes: FileNode[],
  id: string,
  name: string,
): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, name };
    if (n.children) return { ...n, children: renameNode(n.children, id, name) };
    return n;
  });
}

// ─── Update content ───────────────────────────────────────────────────────────

export function updateContent(
  nodes: FileNode[],
  id: string,
  content: string,
): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, content };
    if (n.children)
      return { ...n, children: updateContent(n.children, id, content) };
    return n;
  });
}

// ─── Toggle folder ────────────────────────────────────────────────────────────

export function toggleFolder(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id && n.type === "folder") return { ...n, isOpen: !n.isOpen };
    if (n.children) return { ...n, children: toggleFolder(n.children, id) };
    return n;
  });
}

export function openFolder(nodes: FileNode[], id: string): FileNode[] {
  return nodes.map((n) => {
    if (n.id === id && n.type === "folder") return { ...n, isOpen: true };
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
      if (position === "before" && node.id === targetId) {
        result.push(sourceNode!);
      }

      if (
        position === "inside" &&
        node.id === targetId &&
        node.type === "folder"
      ) {
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

      if (position === "after" && node.id === targetId) {
        result.push(sourceNode!);
      }
    }

    return result;
  };

  return insert(withoutSource);
}
