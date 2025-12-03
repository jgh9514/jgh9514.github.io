<template>
  <CommonSubtitle v-if="title" :label="title" />
  <div class="upload-atfl drop-zone" @drop.prevent="onDrop" @dragover.prevent="onDragOver" @dragleave="onDragLeave">
    <v-file-input
      ref="fileInputRef"
      v-model="files"
      chips
      :variant="Constants.DC_VARIANT"
      :density="Constants.DC_DENSITY"
      :multiple="multiple"
      show-size
      :readonly="readonly"
      :base-color="Constants.DC_BASE_COLOR_GRAY"
      prepend-icon=""
      hide-details="auto"
      :clearable="false"
      :persistent-clear="false"
      :label="readonly && files.length === 0 ? 'No file attached' : undefined"
      :disabled="readonly && files.length === 0"
      @update:model-value="changeFiles"
    >
      <template #selection>
        <template v-for="file in files" :key="file">
          <!-- <v-chip class="me-2" color="primary" size="small" label :append-icon="readonly ? '' : 'mdi-close'" @click="readonly ? downloadFile(file, $event) : $event.stopPropagation()"> -->
          <v-chip class="me-2" color="primary" size="small" label :append-icon="readonly ? '' : 'mdi-close'" @click="downloadFile(file, $event)">
            <template #default>
              <div class="cursor-pointer">
                {{ file.name }}
              </div>
            </template>
            <template v-if="!readonly" #append>
              <v-icon size="large" @click="deleteFile(file, $event)">mdi-close</v-icon>
            </template>
          </v-chip>
        </template>
      </template>

      <template #append-inner>
        <v-btn v-if="!readonly" icon="mdi-upload" color="transparent" flat />
        <v-btn v-if="readonly && files.length > 0" icon="mdi-download" color="transparent" flat @click="clickDownload" />
        <v-btn v-if="!readonly && files.length > 0" icon="mdi-close" color="transparent" flat @click="clickClear" />
      </template>
    </v-file-input>
  </div>
</template>
<script setup>
import { loading } from '@/utils/service'
/**
 * 필요한 기능
 *
 * 개별 다운로드
 * 개별 삭제
 *
 * ALL 삭제
 *
 * 업로드
 * Drag And Drop
 */
//////////////////////////////////////////////////////
// Import 및 데이터 선언 영역
//////////////////////////////////////////////////////
const atflNo = defineModel('atfl-no')
const multiple = defineModel('multiple', { default: false })
const title = defineModel('title')
const deleteCheck = defineModel('delete-check', { default: false })

const readonly = defineModel('readonly', { default: false })

const allowedExtensions = defineModel('allowed-extensions')
const notAllowedExtensions = defineModel('not-allowed-extensions')

const changeConfirm = defineModel('change-confirm')

const emit = defineEmits(['change-files', 'delete-atfl'])

const files = ref([])

let defaultAllowedExtension = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', '7z', 'hwp', 'dwg', 'dxf', 'dwt', 'dws', 'dst', 'dwf', 'dwfx', 'jsp']

let beforeFiles = []
// 물리적으로 저장되어야 할 파일들.
let phyiscalSaveFiles = []
// 물리적으로 삭제되어야 할 파일들.
let physicalDeleteFiles = []

const fileInputRef = ref(null)

//////////////////////////////////////////////////////
// Event 영역
//////////////////////////////////////////////////////
/**
 * 바인딩된 첨부파일 번호가 변경되면 재조회 함.
 */
watch(atflNo, () => {
  search()
})

const changeFiles = async () => {
  if (readonly.value) {
    files.value = beforeFiles
    return
  }
  if ($gfn_isEmpty(files.value)) return
  if (!$gfn_isEmpty(changeConfirm.value)) {
    const res = await changeConfirm.value()
    if (!res) {
      files.value = beforeFiles
      return
    }
  }

  files.value = Array.isArray(files.value) ? files.value : [files.value]

  if (multiple.value) {
    // 다중업로드
    for (const file of files.value) {
      /**
       * 변경점이 들어오면 Extension을 확인한다.
       */
      if (!isAllowedExtension(file)) {
        $toast(file.name + ' ' + $t('는(은) 허용되지 않는 확장자입니다.'), 'error')
        files.value = files.value.filter((file) => isAllowedExtension(file))
        continue
      }
      //  else if (isDuplicateFile(file)) {
      //   $toast(file.name + ' ' + $t('는(은) 중복된 파일입니다.'), 'error')
      //   files.value = files.value.filter((file) => isDuplicateFile(file))
      //   continue
      // }

      // phyiscal file 저장되기 전 사용할 temp_key 발급
      file.temp_key = $gfn_uuid()

      addSaveFileTarget(file)
    }

    files.value = files.value.filter((file) => isAllowedExtension(file))

    files.value = [...beforeFiles, ...files.value]

    setBeforeFiles()
  } else {
    if (beforeFiles.length > 0) {
      if (!$gfn_isEmpty(beforeFiles[0].atfl_sn)) {
        addDeleteFileTarget(beforeFiles[0])
      }
    }

    // 단일업로드
    replaceSaveFileTarget(files.value[0])

    setBeforeFiles()
  }
  emit('change-files', files.value)
}

//////////////////////////////////////////////////////
// Vue Life Cycle 영역
//////////////////////////////////////////////////////
onMounted(async () => {
  // 허용된 확장자 세팅.
  setAllowedExtension()

  if (!$gfn_isEmpty(atflNo.value)) {
    search()
  }
})

//////////////////////////////////////////////////////
// 힘수 구현 영역
//////////////////////////////////////////////////////
const setAllowedExtension = () => {
  if (allowedExtensions.value && allowedExtensions.value.length > 0) {
    // Default 로 지정된 Extension 이외의 값이 있다면 default 에 push 한다.
    defaultAllowedExtension.push(...allowedExtensions.value)
  }

  // 허용되지 않는 리스트를 로직 밑에다 두어 allowed 보다 우선순위를 갖게 함.
  if (notAllowedExtensions.value && notAllowedExtensions.value.length > 0) {
    // 허용되지 않은 Extension 이 있다면 default 에서 지운다.
    defaultAllowedExtension = defaultAllowedExtension.filter((extension) => !notAllowedExtensions.value.includes(extension))
  }

  defaultAllowedExtension = defaultAllowedExtension.map((extension) => extension.toUpperCase())
}

/**
 * File Search 및 Init
 */
const search = async () => {
  if (!$gfn_isEmpty(atflNo.value)) {
    const filelist = await $api.post(`/common/file/${atflNo.value}`, {})
    files.value = []
    filelist.forEach((item) => files.value.push(item))

    beforeFiles = files.value
  }
}

/**
 * download 버튼 이벤트 발생.
 */
const clickDownload = async (event) => {
  event.stopPropagation()

  await downloadAllFile()
}

/**
 * clear 버튼 이벤트 발생.
 */
const clickClear = async (event) => {
  event.stopPropagation()

  if (deleteCheck.value) {
    emit('delete-atfl')
    return
  }

  await deleteAllFile()
}

/**
 * 개별 다운로드
 */
const downloadFile = async (file, event) => {
  event.stopPropagation()
  await downloadPhysicalFile(file)
}

/**
 * 전체 파일 다운로드
 */
const downloadAllFile = async () => {
  files.value.forEach(async (file) => {
    await downloadPhysicalFile(file)
  })
}

/**
 * 물리 파일 다운로드
 */
const downloadPhysicalFile = async (file) => {
  if ($gfn_isEmpty(file.atfl_sn)) {
    // 서버에 저장되지 않은 첨부파일을 다운로드 받는 경우
    $gfn_downloadFileByBlob(file, file.name)
    return
  } else {
    // 서버에 저장된 첨부파일을 다운로드 받는 경우
    const filedata = await $api.post(`/common/file-down/${file.atfl_no}-${file.atfl_sn}`, {})
    $gfn_downloadFileByBlob(filedata, file.name)
  }
}

/**
 * 파일 업로드
 */
const uploadFile = async () => {
  if (uploadValidation()) {
    await physicalUpload()
  }
}

/**
 * Physical File Upload
 */
const physicalUpload = async () => {
  const formData = new FormData()

  for (const file of phyiscalSaveFiles) {
    formData.append('file', file, file.name)
  }

  formData.append('updateKey', $gfn_isEmpty(atflNo.value) ? 0 : atflNo.value)
  formData.append('isPub', 'Y')

  let newAtflNo = null
  if (phyiscalSaveFiles.length > 0) {
    loading.value = true
    const response = await fetch(Constants.BASE_URL + '/common/file', {
      credentials: 'include',
      method: 'POST',
      body: formData,
    })
    loading.value = false

    newAtflNo = await response.text()
  }

  if ($gfn_isEmpty(atflNo.value)) {
    atflNo.value = newAtflNo
  }

  for (const file of physicalDeleteFiles) {
    await physicalDeleteFile(file)
  }

  search()
}

/**
 * 파일 삭제
 */
const deleteFile = async (deleteFile, event) => {
  event.stopPropagation()

  if (deleteCheck.value) {
    emit('delete-atfl')
    return
  }

  if (!multiple.value) {
    if (!$gfn_isEmpty(deleteFile.atfl_sn)) {
      files.value = []
      replaceDeleteFileTarget(deleteFile)
    } else {
      files.value = []
    }
  } else {
    files.value = files.value.filter((file) => {
      const result = file.atfl_sn !== deleteFile.atfl_sn || file.temp_key !== deleteFile.temp_key

      if (!result) addDeleteFileTarget(file)
      return result
    })
  }

  setBeforeFiles()

  emit('change-files', files.value)
}

/**
 * 모든 파일 삭제
 */
const deleteAllFile = async () => {
  findDeleteTarget()

  files.value = []

  setBeforeFiles()

  emit('change-files', files.value)
}

/**
 * Delete 시점에 atfl_sn 이 있으면 물리적 파일 삭제 대상으로 간주함.
 */
const findDeleteTarget = () => {
  const deleteFiles = []
  for (const file of files.value) {
    if (!$gfn_isEmpty(file.atfl_sn)) {
      addDeleteFileTarget(file)
    }
  }
  return deleteFiles
}

/**
 * Physical File 삭제
 */
const physicalDeleteFile = async (file) => {
  await $api.post(`/common/file/${file.atfl_no}-${file.atfl_sn}`)
}

/**
 * files 의 변경점을 찾기위해 beforeFiles 에 현재 파일객체로 업데이트한다.
 */
const setBeforeFiles = () => {
  beforeFiles = files.value
}

/**
 * Upload 파일 유효성 검사.
 */
const uploadValidation = () => {
  // File 확장자 ()
  // files.value = files.value.filter((file) => filterAllowedExtension(file))

  // File 용량
  return true
}

const isDuplicateFile = (file) => {
  files.value.forEach((f) => {
    if (f.name === file.name) {
      return false
    }
  })
  return true
}

/**
 * 허용할거니??
 */
const isAllowedExtension = (file) => {
  const fileExtension = file.name.split('.').pop()
  const upperFileExtension = fileExtension.toUpperCase()
  return defaultAllowedExtension.includes(upperFileExtension)
}

const replaceSaveFileTarget = (file) => {
  phyiscalSaveFiles = []
  phyiscalSaveFiles.push(file)
}

const addSaveFileTarget = (file) => {
  phyiscalSaveFiles.push(file)
}

const replaceDeleteFileTarget = (file) => {
  physicalDeleteFiles = []
  physicalDeleteFiles.push(file)
}

const addDeleteFileTarget = (file) => {
  // 이미 deleteFile에 존재한다면 push 하지 않는다...
  // 이런 로직이 필요할까? (일단 그냥 둔다.)
  if (!$gfn_isEmpty(file.atfl_sn)) {
    physicalDeleteFiles.push(file)
  } else {
    const index = phyiscalSaveFiles.findIndex((f) => f.name === file.name)
    if (index !== -1) {
      phyiscalSaveFiles.splice(index, 1)
    }
  }
}

/**
 * 저장데이터의 초기화
 */
const initSaveDatas = () => {
  phyiscalSaveFiles = []
  physicalDeleteFiles = []
}

const onDragOver = (event) => {
  if (readonly.value) {
    event.preventDefault()
  }
}
const onDragLeave = (event) => {
  if (readonly.value) {
    event.preventDefault()
  }
}
const onDrop = (event) => {
  if (readonly.value) {
    event.preventDefault()
    return
  }

  // FileList -> Array
  const dropFiles = Array.from(event.dataTransfer.files)

  if (dropFiles.length > 1 && !multiple.value) {
    $toast($t('하나의 파일만 업로드 가능합니다.'), 'error')
    return
  }

  // files.value.push(dropFiles)
  // changeFiles()
}

/**
 * Physical Upload 실행.
 */
const saveAtfl = async () => {
  await uploadFile()
  initSaveDatas()

  return true
}

/**
 * 변경사항 존재 여부 확인
 */
const isChangeExists = () => {
  if (phyiscalSaveFiles.length > 0) {
    return true
  }

  if (physicalDeleteFiles.length > 0) {
    return true
  }

  return false
}

/**
 * 파일 존재 여부 확인
 */
const isExists = () => {
  if (files.value.length > 0) {
    return true
  }

  return false
}

const focus = () => {
  fileInputRef.value.focus()
}

/**
 * 컴포넌트 외부에서 Physical Upload 를 할 수 있도록 Expose 한다.
 */
defineExpose({
  saveAtfl,
  isChangeExists,
  isExists,
  focus,
  deleteAllFile,
  initSaveDatas,
})
</script>

<style>
.v-field__input {
  z-index: 5000 !important;
}

.drop-zone {
  width: 100%;
}
</style>
