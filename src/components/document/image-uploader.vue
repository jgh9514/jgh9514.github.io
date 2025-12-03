<template>
  <div class="image-uploader-container">
    <v-row>
      <v-col cols="12">
        <dc-upload-atfl
          ref="uploadAtfl"
          v-model:atfl-no="atflNo"
          :not-allowed-extensions="['bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', '7z', 'hwp']"
          :allowed-extensions="['png', 'jpg', 'jpeg']"
          :multiple="multiple"
          :readonly="readonly"
          @change-files="changeFiles"
        />
        <dc-image-viewer ref="imageViewer" v-model:atfl-no="atflNo" :height="400" />
      </v-col>
    </v-row>
  </div>
</template>
<!-- Composition API -->
<script setup>
const uploadAtfl = ref(null)
const imageViewer = ref(null)

const atflNo = defineModel('atfl-no')
const multiple = defineModel('multiple', { default: false })
const readonly = defineModel('readonly', { default: false })

onMounted(() => {})

const changeFiles = (files) => {
  imageViewer.value.initImages()
  files.forEach((file) => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file)
      imageViewer.value.changeImage(url)
    } else {
      imageViewer.value.changeImage(Constants.BASE_URL + '/common/file-down/image/' + file.atfl_no + '-' + file.atfl_sn)
    }
  })
}

const isExists = () => {
  return uploadAtfl.value.isExists()
}

const isChangeExists = () => {
  return uploadAtfl.value.isChangeExists()
}

const saveAtfl = () => {
  return uploadAtfl.value.saveAtfl()
}

const focus = () => {
  uploadAtfl.value.focus()
}

defineExpose({
  saveAtfl,
  isExists,
  isChangeExists,
  focus,
})
</script>
<style>
.image-uploader-container {
  width: 100%;
  height: 100%;
}

.image-item {
  width: 100% !important;
  border-radius: 8px;
}
</style>
