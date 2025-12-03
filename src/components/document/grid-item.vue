<template>
  <div class="grid-item" :class="['grid-item-' + type, {'essn': essn}]" :style="computedStyles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    cols: {
      type: Number,
      default: 4, // 기본값 4칸 차지
    },
    rowspan: {
      type: Number,
      default: 1, // 기본값 1칸 (rowspan 적용 안 됨)
    },
    type: {
      type: String,
      default: 'value', // value, label
    },
    essn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedStyles() {
      return {
        gridColumn: `span ${this.cols}`,
        gridRow: `span ${this.rowspan}`,
      }
    },
  },
}
</script>

<style scoped>
.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  outline: 2px solid #e2e2e2; /* 📌 border 대신 outline 사용 */
  outline-offset: -1px; /* 📌 자연스럽게 보이도록 조정 */
}
.grid-item-label {
  font-weight: bold;
}
</style>
