<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { VueFlow } from "@vue-flow/core";
import { Controls } from "@vue-flow/controls";
import { Background } from "@vue-flow/background";
import CustomNode from "@/components/CustomNode.vue";
import ControlsPanel from "@/components/ControlsPanel.vue";
import { Lock } from "lucide-vue-next";
import { useDiagramState } from "@/composables/useDiagramState";
import { useDiagramEvents } from "@/composables/useDiagramEvents";
import { useDiagramShortcuts } from "@/composables/useDiagramShortcuts";

const diagramState = useDiagramState();


const events = useDiagramEvents({
  selectedElements: diagramState.selectedElements,
  isLocked: diagramState.isLocked,
  nodes: diagramState.nodes,
  edges: diagramState.edges,
  addNodes: diagramState.addNodes,
  addEdges: diagramState.addEdges,
  setNodes: diagramState.setNodes,
  setEdges: diagramState.setEdges,
  project: diagramState.project,
  contextMenu: diagramState.contextMenu,
});
const shortcuts = useDiagramShortcuts({
  isLocked: diagramState.isLocked,
  selectedElements: diagramState.selectedElements,
  nodes: diagramState.nodes,
  edges: diagramState.edges,
  removeSelectedElements: diagramState.removeSelectedElements,
  selectedTool: diagramState.selectedTool,
  // closeContextMenu: () => {}, 
  history: diagramState.history,
  historyIndex: diagramState.historyIndex,
});

function handleUpdateNode(id: string, update: any) {
  // Update node di diagramState
  const updatedNodes = diagramState.nodes.value.map((node: any) =>
    node.id === id ? { ...node, ...update } : node
  );
  diagramState.setNodes(updatedNodes);
  diagramState.saveState();
}

// --- Initial setup ---
onMounted(() => {
  diagramState.setNodes([
    {
      id: "1",
      type: "custom",
      label: "Test 1",
      position: { x: 100, y: 100 },
    },
    {
      id: "2",
      type: "custom",
      label: "Test 2",
      position: { x: 400, y: 150 },
    },
  ]);
  diagramState.setEdges([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      type: "custom",
    },
  ]);
  document.addEventListener("keydown", shortcuts.handleKeyDown);
  diagramState.fitView();
});

onUnmounted(() => {
  document.removeEventListener("keydown", shortcuts.handleKeyDown);
});
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-gray-50">
    <!-- Lock Status -->
    <div
      v-if="diagramState.isLocked.value"
      class="bg-yellow-50 border-b border-yellow-200 px-6 py-2"
    >
      <div class="text-sm text-yellow-800 flex items-center gap-2">
        <Lock class="w-4 h-4" />
        Canvas is locked - interactions are disabled
      </div>
    </div>
    <!-- Vue Flow Container -->
    <div class="flex-1 relative">
      <VueFlow
        :nodes="diagramState.nodes.value"
        :edges="diagramState.edges.value"
        :default-viewport="diagramState.defaultViewport"
        :fit-view-on-init="true"
        :nodes-draggable="!diagramState.isLocked.value"
        :edges-updatable="!diagramState.isLocked.value"
        :nodes-connectable="!diagramState.isLocked.value"
        @node-click="events.onNodeClick"
        @edge-click="events.onEdgeClick"
        @connect="events.onConnect"
        @selection-change="events.onSelectionChange"
        @pane-context-menu="events.onPaneContextMenu"
        @node-context-menu="events.onNodeContextMenu"
        @edge-context-menu="events.onEdgeContextMenu"
        @nodes-change="diagramState.saveState"
        @edges-change="diagramState.saveState"
        class="bg-gray-50"
      >
        <template #node-custom="{ id, label, data, selected }">
          <CustomNode
            :id="id"
            :label="label"
            :data="data"
            :selected="selected"
            @update-node="handleUpdateNode"
          />
        </template>
        <div class="flex justify-center py-6 bg-gray-50">
          <ControlsPanel
            :selected-tool="diagramState.selectedTool.value"
            :selected-elements="diagramState.selectedElements.value"
            :is-locked="diagramState.isLocked.value"
            :history-index="diagramState.historyIndex.value"
            :history-length="diagramState.history.value.length"
            @tool-change="diagramState.handleToolChange"
            @lock-toggle="diagramState.handleLockToggle"
            @add-shape="diagramState.handleAddShape"
            @save-diagram="diagramState.saveDiagram"
            @load-diagram="diagramState.loadDiagram"
            @fit-view="diagramState.fitView"
            @zoom-in="diagramState.zoomIn"
            @zoom-out="diagramState.zoomOut"
            @undo="diagramState.undo"
            @redo="diagramState.redo"
            @remove-selected="diagramState.removeSelectedElements"
          />
        </div>
       
        <Controls class="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg" />
        <Background />
      </VueFlow>
    </div>
  </div>
</template>

<style>
/* Connection line styling */
.vue-flow__connection-line {
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
}
</style>
