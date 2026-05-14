import { useEffect, useRef } from "react";
import { FilePlus, FolderPlus, Pencil, Trash2, FolderOpen } from "lucide-react";
import type { ContextMenuState } from "../../types";
import { useFileExplorerContext } from "../../context/FileExplorerContext";

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
      if (e.key === "Escape") onHideContextMenu();
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, [onHideContextMenu]);

  // Adjust position so menu doesn't overflow viewport
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    left: Math.min(menu.x, window.innerWidth - 180),
    top: Math.min(menu.y, window.innerHeight - 200),
  };

  const folderItems: MenuItem[] = [
    {
      label: "New File",
      icon: <FilePlus size={13} />,
      action: () => {
        onCreateNode("file", menu.nodeId);
        onHideContextMenu();
      },
    },
    {
      label: "New Folder",
      icon: <FolderPlus size={13} />,
      action: () => {
        onCreateNode("folder", menu.nodeId);
        onHideContextMenu();
      },
    },
    {
      label: "Rename",
      icon: <Pencil size={13} />,
      action: () => {
        onStartRename(menu.nodeId);
        onHideContextMenu();
      },
      dividerBefore: true,
    },
    {
      label: "Delete",
      icon: <Trash2 size={13} />,
      action: () => {
        onDeleteNode(menu.nodeId);
      },
      danger: true,
    },
  ];

  const fileItems: MenuItem[] = [
    {
      label: "Open",
      icon: <FolderOpen size={13} />,
      action: () => {
        onOpenFile(menu.nodeId);
      },
    },
    {
      label: "Rename",
      icon: <Pencil size={13} />,
      action: () => {
        onStartRename(menu.nodeId);
        onHideContextMenu();
      },
    },
    {
      label: "Delete",
      icon: <Trash2 size={13} />,
      action: () => {
        onDeleteNode(menu.nodeId);
      },
      danger: true,
    },
  ];

  const items = menu.nodeType === "folder" ? folderItems : fileItems;

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
            onClick={(e) => {
              e.stopPropagation();
              item.action();
            }}
            className={`
              w-full flex items-center gap-2.5 px-3 py-1.5 text-sm
              transition-colors duration-100
              ${
                item.danger
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-[var(--text)] hover:bg-[var(--hover)]"
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
