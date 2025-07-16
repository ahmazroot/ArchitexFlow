import { ref, watch, nextTick } from "vue";
import { useVueFlow, type Node, type Edge } from "@vue-flow/core";

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  target: Node | Edge | null;
  type: "canvas" | "node" | "edge" | null;
}

export function useDiagramState() {
  // State
  const selectedElements = ref<any[]>([]);
  const selectedTool = ref<string>("select");
  const isLocked = ref<boolean>(false);
  const history = ref<any[]>([]);
  const historyIndex = ref<number>(-1);
  const contextMenu = ref<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    target: null,
    type: null,
  });

  const defaultViewport = { zoom: 1.5, x: 0, y: 0 };
  const {
    nodes,
    edges,
    addNodes,
    addEdges,
    fitView,
    zoomIn,
    zoomOut,
    setNodes,
    setEdges,
    removeNodes,
    removeEdges,
    project,
  } = useVueFlow();

  // State Management
  const saveDiagram = (): void => {
    const diagramData = {
      nodes: nodes.value,
      edges: edges.value,
    };
    localStorage.setItem("vue-flow-diagram", JSON.stringify(diagramData));
    alert("Diagram saved!");
  };

  const loadDiagram = () => {
    const savedData = localStorage.getItem("vue-flow-diagram");
    if (savedData) {
      const diagramData = JSON.parse(savedData);
      setNodes(diagramData.nodes);
      setEdges(diagramData.edges);
      fitView();
      alert("Diagram loaded!");
    } else {
      alert("No saved diagram found.");
    }
  };

  // Undo/Redo
  const saveState = () => {
    history.value.splice(historyIndex.value + 1);
    history.value.push({
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value)),
    });
    historyIndex.value = history.value.length - 1;
  };

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      const prevState = history.value[historyIndex.value];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
    }
  };

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      const nextState = history.value[historyIndex.value];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  };

  // Tool & Lock
  const handleToolChange = (toolId: string, action: string) => {
    selectedTool.value = toolId;
  };
  const handleLockToggle = (locked: boolean) => {
    isLocked.value = locked;
    console.log("isLocked changed to:", isLocked.value);
  };

  // Add Shape
  const handleAddShape = (shapeType: string) => {
    const position = { x: 300, y: 200 };
    const shapeConfig: any = {
      rectangle: {
        label: "Rectangle",
        // description: "A rectangular node",
        shape: "rectangle",
      },
      circle: {
        label: "Circle",
        // description: "A circular node",
        shape: "circle",
      },
    };
    const config = shapeConfig[shapeType] || shapeConfig.rectangle;
    const newNode: Node = {
      id: `${shapeType}-${Date.now()}`,
      type: "custom",
      label: config.label,
      data: config,
      position,
    };
    addNodes([newNode]);
  };

  // Remove selected
  const removeSelectedElements = () => {
    if (selectedElements.value.length === 0) return;
    const nodeIdsToRemove = selectedElements.value
      .filter((el: any) => el.type === "node")
      .map((el: any) => el.id);
    const edgeIdsToRemove = selectedElements.value
      .filter((el: any) => el.type === "edge")
      .map((el: any) => el.id);
    const connectedEdgeIds = edges.value
      .filter((edge: Edge) =>
        nodeIdsToRemove.includes(edge.source) ||
        nodeIdsToRemove.includes(edge.target)
      )
      .map((edge: Edge) => edge.id);
    const allEdgeIdsToRemove = [...new Set([...edgeIdsToRemove, ...connectedEdgeIds])];
    if (nodeIdsToRemove.length > 0) removeNodes(nodeIdsToRemove);
    if (allEdgeIdsToRemove.length > 0) removeEdges(allEdgeIdsToRemove);
    selectedElements.value = [];
  };

  // Watch selection to update selected state
  watch(
    selectedElements,
    (newSelection) => {
      const updatedNodes = nodes.value.map((node: Node) => ({
        ...node,
        selected: newSelection.some((el: any) => el.id === node.id && el.type === "node"),
      }));
      const updatedEdges = edges.value.map((edge: Edge) => ({
        ...edge,
        selected: newSelection.some((el: any) => el.id === edge.id && el.type === "edge"),
      }));
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    },
    { deep: true }
  );

  // Initial save state
  nextTick(() => {
    saveState();
  });

  return {
    nodes,
    edges,
    addNodes,
    addEdges,
    fitView,
    zoomIn,
    zoomOut,
    setNodes,
    setEdges,
    removeNodes,
    removeEdges,
    selectedElements,
    selectedTool,
    isLocked,
    history,
    historyIndex,
    defaultViewport,
    saveDiagram,
    loadDiagram,
    saveState,
    undo,
    redo,
    handleToolChange,
    handleLockToggle,
    handleAddShape,
    removeSelectedElements,
    contextMenu,
    project,
  };
} 