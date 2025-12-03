<template>
  <div v-if="!$gfn_isEmpty(atflKey)">
    <iframe style="height: 80vh" :src="'/pdf/web/viewer.html?file=' + encodeURIComponent(`${Constants.BASE_URL}/common/file-down/` + atflKey)" width="100%" />
  </div>
</template>
<script setup>
const emit = defineEmits(['afterprint', 'download'])

const pdfViewFlag = ref(true)
const atflKey = defineModel('atfl-key')

watch(atflKey, () => {
  if (!$gfn_isEmpty(atflKey.value)) {
    pdfViewFlag.value = false
    setTimeout(() => {
      pdfViewFlag.value = true
    }, 1000)
  }
})

onMounted(() => {
  window.addEventListener('message', eventCalllbackListener)
})
onUnmounted(() => {
  window.removeEventListener('message', eventCalllbackListener)
})

const eventCalllbackListener = (e) => {
  const eventName = e.data.jasperCustomEvent
  if (eventName === 'afterprint') {
    // iframe 에서 '인쇄' 버튼 눌렀을 때
    emit('afterprint', undefined)
  } else if (eventName === 'download') {
    // Download 할 때.
    emit('download', undefined)
  }
}
</script>
