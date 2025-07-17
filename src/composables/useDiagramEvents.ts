import type { Node, Edge } from "@vue-flow/core";

export function useDiagramEvents({
  selectedElements,
  isLocked,
  edges,
  addEdges,
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
      ...selectedNodes.map((node: Node) => ({
        ...node,
        type: "node" as const,
      })),
      ...selectedEdges.map((edge: Edge) => ({
        ...edge,
        type: "edge" as const,
      })),
    ];
  };

  return {
    onNodeClick,
    onEdgeClick,
    onConnect,
    onSelectionChange,
  };
}
