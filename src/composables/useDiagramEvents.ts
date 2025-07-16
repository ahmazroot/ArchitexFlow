import { ref } from "vue";
import type { Node, Edge } from "@vue-flow/core";

export function useDiagramEvents({
  selectedElements,
  isLocked,
  nodes,
  edges,
  addNodes,
  addEdges,
  setNodes,
  setEdges,
  project,
  closeContextMenu,
  contextMenu,
}: any) {
  // Node click
  const onNodeClick = (event: any) => {
    if (isLocked.value) return;
    const { node, event: mouseEvent } = event;
    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
      const isAlreadySelected = selectedElements.value.some(
        (el: any) => el.id === node.id && el.type === "node"
      );
      if (isAlreadySelected) {
        selectedElements.value = selectedElements.value.filter(
          (el: any) => !(el.id === node.id && el.type === "node")
        );
      } else {
        selectedElements.value.push({ ...node, type: "node" });
      }
    } else {
      selectedElements.value = [{ ...node, type: "node" }];
    }
  };

  // Edge click
  const onEdgeClick = (event: any) => {
    if (isLocked.value) return;
    const { edge, event: mouseEvent } = event;
    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
      const isAlreadySelected = selectedElements.value.some(
        (el: any) => el.id === edge.id && el.type === "edge"
      );
      if (isAlreadySelected) {
        selectedElements.value = selectedElements.value.filter(
          (el: any) => !(el.id === edge.id && el.type === "edge")
        );
      } else {
        selectedElements.value.push({ ...edge, type: "edge" });
      }
    } else {
      selectedElements.value = [{ ...edge, type: "edge" }];
    }
  };

  // Connect
  const onConnect = (connection: any) => {
    if (isLocked.value) return;
    if (
      connection.source &&
      connection.target &&
      connection.source !== connection.target
    ) {
      const existingEdge = edges.value.find(
        (edge: Edge) =>
          edge.source === connection.source && edge.target === connection.target
      );
      if (!existingEdge) {
        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          type: "custom",
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
          data: { label: "" },
          ...connection,
        };
        addEdges([newEdge]);
      }
    }
  };

  // Selection change
  const onSelectionChange = (event: any) => {
    const { nodes: selectedNodes, edges: selectedEdges } = event;
    selectedElements.value = [
      ...selectedNodes.map((node: Node) => ({ ...node, type: "node" as const })),
      ...selectedEdges.map((edge: Edge) => ({ ...edge, type: "edge" as const })),
    ];
  };

  // Context menu
  const onPaneContextMenu = (event: any) => {
    if (isLocked.value) return;
    event.preventDefault();
    closeContextMenu();
    selectedElements.value = [];
    contextMenu.value = {
      show: true,
      x: event.clientX,
      y: event.clientY,
      target: null,
      type: "canvas",
    };
  };

  const onNodeContextMenu = (event: any) => {
    if (isLocked.value) return;
    const { event: mouseEvent, node } = event;
    mouseEvent.preventDefault();
    closeContextMenu();
    if (!selectedElements.value.some((el: any) => el.id === node.id && el.type === "node")) {
      selectedElements.value = [{ ...node, type: "node" }];
    }
    contextMenu.value = {
      show: true,
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
      target: node,
      type: "node",
    };
  };

  const onEdgeContextMenu = (event: any) => {
    if (isLocked.value) return;
    const { event: mouseEvent, edge } = event;
    mouseEvent.preventDefault();
    closeContextMenu();
    if (!selectedElements.value.some((el: any) => el.id === edge.id && el.type === "edge")) {
      selectedElements.value = [{ ...edge, type: "edge" }];
    }
    contextMenu.value = {
      show: true,
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
      target: edge,
      type: "edge",
    };
  };

  return {
    onNodeClick,
    onEdgeClick,
    onConnect,
    onSelectionChange,
    onPaneContextMenu,
    onNodeContextMenu,
    onEdgeContextMenu,
  };
} 