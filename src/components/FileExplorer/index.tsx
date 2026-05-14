import { useEffect } from "react";
import FileExplorerContext, {
  type FileExplorerContextValue,
} from "../../context/FileExplorerContext";
import Toolbar from "./Toolbar";
import TreeView from "./TreeView";
import ContextMenu from "./ContextMenu";

export default function FileExplorer(props: FileExplorerContextValue) {
  const { onHideContextMenu } = props;

  // Close context menu on Escape globally
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onHideContextMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onHideContextMenu]);

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
