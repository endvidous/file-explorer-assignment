import { useRef } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import type { FileNode, DropPosition } from "../../types";
import { useFileExplorerContext } from "../../context/FileExplorerContext";
import InlineInput from "./InlineInput";

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

  const isSelected = selectedId === node.id;
  const isOpenFile = openFileId === node.id;
  const isExpanded = node.type === "folder" && !!node.isOpen;
  const isRenaming = renamingId === node.id;
  const isDragging = dragState.sourceId === node.id;
  const isOver = dragState.overId === node.id;
  const dropPos = isOver ? dragState.position : null;

  // ── Interaction ─────────────────────────────────────────────────────────────

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    if (node.type === "folder") onToggleFolder(node.id);
    else onOpenFile(node.id);
  };

  // ── Drag ────────────────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    // Slight delay so the drag ghost renders first
    setTimeout(() => onStartDrag(node.id), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rowRef.current || dragState.sourceId === node.id) return;

    const rect = rowRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const h = rect.height;

    let position: DropPosition;
    if (node.type === "folder") {
      if (relY < h * 0.25) position = "before";
      else if (relY > h * 0.75) position = "after";
      else position = "inside";
    } else {
      position = relY < h / 2 ? "before" : "after";
    }

    onDragOver(node.id, position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving this node (not entering a child)
    if (!rowRef.current?.contains(e.relatedTarget as Node)) {
      onDragOver(node.id, dragState.position ?? "after"); // keep last position
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
    ? "bg-[var(--selected)] text-[var(--text)] border-l-2 border-[var(--accent)]"
    : "text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)] border-l-2 border-transparent";

  const rowDrag = isDragging ? "opacity-40" : "opacity-100";

  const rowInside =
    dropPos === "inside"
      ? "ring-1 ring-inset ring-[var(--accent)] rounded-sm"
      : "";

  const indentPx = depth * 12 + 8;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-node-in">
      {/* Drop indicator — BEFORE */}
      {dropPos === "before" && (
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
        {node.type === "folder" ? (
          <ChevronRight
            size={13}
            className={`flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        {/* Icon */}
        {node.type === "folder" ? (
          isExpanded ? (
            <FolderOpen size={14} className="flex-shrink-0 text-amber-400" />
          ) : (
            <Folder
              size={14}
              className="flex-shrink-0 text-amber-400 dark:text-amber-300"
            />
          )
        ) : (
          <FileText
            size={13}
            className={`flex-shrink-0 ${
              isOpenFile ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
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
              isOpenFile ? "text-[var(--text)]" : ""
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
      {dropPos === "after" && (
        <div
          className="h-px mx-2 rounded-full bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]"
          style={{ marginLeft: indentPx }}
        />
      )}

      {/* Children — animated expand/collapse */}
      {node.type === "folder" && node.children && (
        <div
          className={`tree-children ${isExpanded ? "open" : ""}`}
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
