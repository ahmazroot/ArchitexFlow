<script setup>
import { BaseEdge, getStraightPath, EdgeText } from "@vue-flow/core";
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  data: Object,
  markerEnd: String,
  style: Object,
});

const path = computed(() =>
  getStraightPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
  })
);

const label = computed(() => props.data?.label || "Custom Edge");
</script>

<template>
  <BaseEdge
    v-bind="$attrs"
    :path="path[0]"
    :marker-end="markerEnd"
    :style="style"
  />
  <EdgeText
    :x="path[1]"
    :y="path[2]"
    :label="label"
    :label-style="{ fill: '#333' }"
    :bg-style="{ fill: '#fff' }"
    :bg-radius="5"
    :bg-padding="5"
  />
</template>
