<template>
  <div class="ckeditor">
    <ckeditor v-model="content" :config="config" :read-only="readonly" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { component as ckeditor } from '@mayasabha/ckeditor4-vue3'
const content = defineModel()
const height = defineModel('height')
const readonly = defineModel('readonly', { default: false })

const config = ref({
  height: height.value ? height.value : readonly.value ? 300 : 400,
  allowedContent: true,
  disallowedContent: 'script iframe object form input meta base *[on*]',
  contentsCss: ['/css/ckeditor.css', '/css/tableselection.css'],
  toolbar: readonly.value ? [] : undefined,
})

</script>
<style scoped>
.ckeditor {
  width: 100%;
}
.cke_show_borders table.cke_show_border,
.cke_show_borders table.cke_show_border > tr > td,
.cke_show_borders table.cke_show_border > tr > th,
.cke_show_borders table.cke_show_border > tbody > tr > td,
.cke_show_borders table.cke_show_border > tbody > tr > th,
.cke_show_borders table.cke_show_border > thead > tr > td,
.cke_show_borders table.cke_show_border > thead > tr > th,
.cke_show_borders table.cke_show_border > tfoot > tr > td,
.cke_show_borders table.cke_show_border > tfoot > tr > th {
  border: none;
}
</style>
