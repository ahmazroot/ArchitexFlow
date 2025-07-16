import { ref, computed, nextTick } from "vue";

export function useCustomNode(props: any, emit: any) {
  const isEditing = ref(false);
  const editText = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  const getShapeClasses = () => {
    const shape = props.data?.shape || "rectangle";
    switch (shape) {
      case "circle":
        return "rounded-full aspect-square w-24 bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-blue-400";
      case "rectangle":
      default:
        return "rounded-lg w-28 h-16 bg-gradient-to-br from-emerald-200 to-teal-200 border-2 border-emerald-400";
    }
  };

  const nodeClass = computed(() => {
    const base = "relative shadow-lg transition-all duration-200 cursor-pointer";
    const selected = props.selected
      ? "ring-2 ring-blue-200 shadow-blue-200"
      : "hover:shadow-xl";
    const shape = getShapeClasses();
    return `${base} ${selected} ${shape}`;
  });

  const contentWrapperClass = computed(() => {
    const shape = props.data?.shape || "rectangle";
    if (shape === "diamond") {
      return "flex items-center justify-center w-full h-full -rotate-45";
    }
    return "flex items-center justify-center w-full h-full";
  });

  const textColorClass = computed(() => {
    const shape = props.data?.shape || "rectangle";
    switch (shape) {
      case "circle":
        return "text-blue-800";
      case "rectangle":
      default:
        return "text-emerald-800";
    }
  });

  const descriptionColorClass = computed(() => {
    const shape = props.data?.shape || "rectangle";
    switch (shape) {
      case "circle":
        return "text-blue-600";
      case "rectangle":
      default:
        return "text-emerald-600";
    }
  });

  const startEditing = () => {
    isEditing.value = true;
    editText.value = props.label || "";
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
        inputRef.value.select();
      }
    });
  };

  const finishEditing = () => {
    if (editText.value.trim() !== props.label) {
      emit("update-node", props.id, { label: editText.value.trim() });
    }
    isEditing.value = false;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      finishEditing();
    } else if (event.key === "Escape") {
      isEditing.value = false;
    }
  };

  const handleDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();
    startEditing();
  };

  return {
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
  };
} 