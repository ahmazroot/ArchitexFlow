interface ShortcutsDeps {
  isLocked: any;
  selectedElements: any;
  nodes: any;
  edges: any;
  removeSelectedElements: () => void;
  selectedTool: any;
//   closeContextMenu: () => void;
  history: any;
  historyIndex: any;
}

export function useDiagramShortcuts({
  isLocked,
  selectedElements,
  nodes,
  edges,
  removeSelectedElements,
  selectedTool,
//   closeContextMenu,
  history,
  historyIndex,
}: ShortcutsDeps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isLocked.value) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeSelectedElements();
    }
    const toolShortcuts: { [key: string]: string } = {
      1: "select",
      2: "rectangle",
      4: "circle",
    };
    if (toolShortcuts[event.key]) {
      event.preventDefault();
      selectedTool.value = toolShortcuts[event.key];
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "a") {
      event.preventDefault();
      selectedElements.value = [
        ...nodes.value.map((node: any) => ({ ...node, type: "node" as const })),
        ...edges.value.map((edge: any) => ({ ...edge, type: "edge" as const })),
      ];
    }
    if (event.key === "Escape") {
      selectedElements.value = [];
    //   closeContextMenu();
    }
  };
  return { handleKeyDown };
} 