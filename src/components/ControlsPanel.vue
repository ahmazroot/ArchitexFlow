<script setup>
import { computed } from "vue";
import {
  Lock,
  Unlock,
  Square,
  Circle,
  Save,
  FolderOpen,
  Maximize,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Trash2,
} from "lucide-vue-next";

const props = defineProps({
  selectedTool: {
    type: String,
    default: "select",
  },
  selectedElements: {
    type: Array,
    default: () => [],
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  historyIndex: {
    type: Number,
    default: -1,
  },
  historyLength: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  "tool-change",
  "lock-toggle",
  "add-shape",
  "save-diagram",
  "load-diagram",
  "fit-view",
  "zoom-in",
  "zoom-out",
  "undo",
  "redo",
  "remove-selected",
]);

const tools = computed(() => [
  {
    id: "lock",
    icon: props.isLocked ? Lock : Unlock,
    action: "lock",
    type: "button",
  },
  {
    id: "rectangle",
    icon: Square,
    action: "shape",
    type: "button",
  },
  {
    id: "circle",
    icon: Circle,
    action: "shape",
    type: "button",
  },
  { id: "divider-1", type: "divider" },
  {
    id: "save",
    icon: Save,
    action: "save-diagram",
    type: "button",
    style: "green",
  },
  {
    id: "load",
    icon: FolderOpen,
    action: "load-diagram",
    type: "button",
    style: "green",
  },
  { id: "divider-2", type: "divider" },
  {
    id: "fit-view",
    icon: Maximize,
    action: "fit-view",
    type: "button",
    style: "gray",
  },
  {
    id: "zoom-in",
    icon: ZoomIn,
    action: "zoom-in",
    type: "button",
    style: "gray",
  },
  {
    id: "zoom-out",
    icon: ZoomOut,
    action: "zoom-out",
    type: "button",
    style: "gray",
  },
  { id: "divider-3", type: "divider" },
  {
    id: "undo",
    icon: Undo,
    action: "undo",
    type: "button",
    style: "gray",
    disabled: () => props.historyIndex <= 0,
  },
  {
    id: "redo",
    icon: Redo,
    action: "redo",
    type: "button",
    style: "gray",
    disabled: () => props.historyIndex >= props.historyLength - 1,
  },
  { id: "divider-4", type: "divider" },
  {
    id: "remove",
    icon: Trash2,
    action: "remove-selected",
    type: "button",
    style: "red",
    disabled: () => props.selectedElements.length === 0 || props.isLocked,
  },
]);

const handleToolClick = (tool) => {
  if (tool.disabled && tool.disabled()) return;

  switch (tool.action) {
    case "lock":
      emit("lock-toggle", !props.isLocked);
      break;
    case "shape":
      emit("tool-change", tool.id, tool.action);
      emit("add-shape", tool.id);
      break;
    case "save-diagram":
      emit("save-diagram");
      break;
    case "load-diagram":
      emit("load-diagram");
      break;
    case "fit-view":
      emit("fit-view");
      break;
    case "zoom-in":
      emit("zoom-in");
      break;
    case "zoom-out":
      emit("zoom-out");
      break;
    case "undo":
      emit("undo");
      break;
    case "redo":
      emit("redo");
      break;
    case "remove-selected":
      emit("remove-selected");
      break;
    default:
      emit("tool-change", tool.id, tool.action);
      break;
  }
};

const isToolActive = (tool) =>
  tool.id === "lock" ? props.isLocked : props.selectedTool === tool.id;

const getButtonClass = (tool) => {
  const baseClass =
    "flex items-center justify-center rounded-xl transition-all duration-200";
  const disabledClass =
    tool.disabled && tool.disabled() ? "opacity-50 cursor-not-allowed" : "";
  let styleClass = isToolActive(tool)
    ? "bg-purple-200 text-purple-700 shadow-sm"
    : tool.style === "green"
    ? "bg-green-100 text-green-700 hover:bg-green-200"
    : tool.style === "red"
    ? "bg-red-600 text-white hover:bg-red-700 shadow-sm"
    : tool.style === "gray"
    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800";

  return `${baseClass} w-12 h-12 ${styleClass} ${disabledClass}`;
};
</script>

<template>
  <div class="flex z-50 flex-col items-center space-y-4">
    <div
      class="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 px-2 py-2 gap-1 flex-wrap max-w-7xl"
    >
      <template
        v-for="tool in tools"
        :key="tool.id"
      >
        <div
          v-if="tool.type === 'divider'"
          class="h-8 w-px bg-gray-300 mx-1"
        ></div>
        <button
          v-else
          @click="handleToolClick(tool)"
          :class="getButtonClass(tool)"
          :disabled="tool.disabled && tool.disabled()"
        >
          <component
            :is="tool.icon"
            class="w-5 h-5"
          />
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
button:active {
  transform: scale(0.95);
}

@media (max-width: 1200px) {
  .max-w-7xl {
    max-width: 100%;
    justify-content: center;
  }
}
</style>
