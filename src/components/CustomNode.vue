<script setup>
import { Handle, Position } from "@vue-flow/core";
import { useCustomNode } from "@/composables/useCustomNode";

const props = defineProps({
  id: String,
  label: String,
  data: Object,
  selected: Boolean,
});

const emit = defineEmits(["update-node"]);

const {
  isEditing,
  editText,
  inputRef,
  nodeClass,
  contentWrapperClass,
  textColorClass,
  descriptionColorClass,
  startEditing,
  finishEditing,
  handleKeydown,
  handleDoubleClick,
} = useCustomNode(props, emit);
</script>

<template>
  <div
    :class="nodeClass"
    @dblclick="handleDoubleClick"
  >
    <Handle
      type="target"
      :position="Position.Left"
      class="w-3 h-3 bg-emerald-500 border-2 border-white hover:bg-emerald-600 transition-colors"
    />

    <div :class="contentWrapperClass">
      <div class="text-center w-full">
        <!-- Edit Mode -->
        <input
          v-if="isEditing"
          ref="inputRef"
          v-model="editText"
          @blur="finishEditing"
          @keydown="handleKeydown"
          class="bg-transparent border-none outline-none text-center font-semibold text-sm w-full"
          :class="textColorClass"
        />

        <!-- Display Mode -->
        <template v-else>
          <div
            class="font-semibold text-sm"
            :class="textColorClass"
          >
            {{ label }}
          </div>
          <p
            v-if="data && data.description"
            class="text-xs mt-1"
            :class="descriptionColorClass"
          >
            {{ data.description }}
          </p>
        </template>
      </div>
    </div>

    <Handle
      type="source"
      :position="Position.Right"
      class="w-3 h-3 bg-emerald-500 border-2 border-white hover:bg-emerald-600 transition-colors"
    />

    <div
      v-if="!isEditing && selected"
      class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
    >
      Double-click to edit
    </div>
  </div>
</template>

<style scoped>
input {
  background: transparent !important;
  min-width: 60px;
}
</style>
