<template>
  <div class="image-uploader-container">
    <v-row>
      <v-col cols="12">
        <dc-upload-atfl
          v-if="!readonly"
          ref="uploadAtfl"
          v-model:atfl-no="atflNo"
          :not-allowed-extensions="['bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', '7z', 'hwp']"
          :allowed-extensions="['png', 'jpg', 'jpeg']"
          :multiple="multiple"
          :readonly="readonly"
          :delete-check="true"
          :change-confirm="() => $confirm($t('사업장 조감도 변경 시 위치정보가 삭제됩니다. 변경하시겠습니까?'))"
          @change-files="changeFiles"
          @delete-atfl="deleteAtfl"
        />
        <div class="viewer">
          <!-- <v-img :src="currentImageUrl" style="width: 100%; max-height: 300px" loading="lazy" cover @mousedown.prevent @dragstart.prevent @click.prevent /> -->
          <v-row>
            <v-col v-for="(item, i) in images" :key="i" :src="item" col="2">
              <v-img ref="wkplImage" :lazy-src="item" :src="item" class="cursor-pointer" cover @click="!readonly && wkplLocClick($event)" @click.stop>
                <v-menu v-for="(loc, index) in locList" :key="index" v-model="loc.index" :close-on-click="false" :close-on-content-click="false">
                  <template #activator="{ props }">
                    <div
                      class="loc-icon"
                      v-bind="props"
                      :style="{
                        position: 'absolute',
                        top: loc.wkpl_loc_y_crd + '%',
                        left: loc.wkpl_loc_x_crd + '%',
                        backgroundColor: '#005eb8',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }"
                      :data-id="loc.wkpl_loc_id"
                    >
                      <i class="v-icon notranslate mdi mdi-map-marker theme--light" style="color: white" />
                      <!-- <v-icon v-bind="attrs" color="white" v-on="on">mdi-map-marker</v-icon> -->
                    </div>
                  </template>
                  <!-- 작업현황 Map -->
                  <v-card v-if="readonly" style="opacity: 0.9">
                    <v-toolbar color="tonal" height="40" flat>
                      <v-toolbar-title>{{ loc.prcs_nm }}</v-toolbar-title>
                      <template #append>
                        <v-btn icon="mdi-close" size="x-small" variant="plain" @click="loc.index = !loc.index" />
                      </template>
                    </v-toolbar>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-content>
                          <v-table density="compact">
                            <tbody>
                              <tr>
                                <td>{{ $t('화기') }}</td>
                                <td>{{ loc.fi_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('중장비') }}</td>
                                <td>{{ loc.hv_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('밀폐') }}</td>
                                <td>{{ loc.cl_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('고소') }}</td>
                                <td>{{ loc.hh_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('전기') }}</td>
                                <td>{{ loc.hh_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('굴착') }}</td>
                                <td>{{ loc.ex_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('방사능') }}</td>
                                <td>{{ loc.rd_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('일반') }}</td>
                                <td>{{ loc.gn_cnt }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('환경_일반') }}</td>
                                <td>{{ loc.gne_cnt }}</td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-img>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<!-- Composition API -->
<script setup>
const emit = defineEmits(['image-click', 'image-change', 'image-delete'])

const uploadAtfl = ref(null)
const wkplImage = ref(null)

const currentImageUrl = ref('0')
const atflNo = defineModel('atfl-no')
const images = ref([])
const locList = ref([])

const multiple = defineModel('multiple', { default: false })
const readonly = defineModel('readonly', { default: false })

watch(atflNo, () => {
  search()
})

onMounted(() => {
  if (!$gfn_isEmpty(atflNo.value)) {
    search()
  }
})

const search = async () => {
  images.value = []
  const filelist = await $api.post(`/common/file/${atflNo.value}`, {})
  const tempImages = []
  for (const item of filelist) {
    tempImages.push(Constants.BASE_URL + '/common/file-down/image/' + item.atfl_no + '-' + item.atfl_sn)
  }
  images.value = tempImages
}

const changeFiles = (files) => {
  if (files.length === 0) {
    // 조감도 파일 삭제한 경우
    return
  }

  initImages()
  files.forEach((file) => {
    if (file instanceof File) {
      currentImageUrl.value = URL.createObjectURL(file)
      changeImage(currentImageUrl.value)
    } else {
      currentImageUrl.value = Constants.BASE_URL + '/common/file-down/image/' + file.atfl_no + '-' + file.atfl_sn
    }
  })
  emit('image-change')
}

const changeImage = (url) => {
  images.value.push(url)
  currentImageUrl.value = images.value.length - 1
}

const initImages = async () => {
  images.value = []
  currentImageUrl.value = 0
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

const deleteAtfl = () => {
  emit('image-delete')
}

const deleteAllFile = async () => {
  images.value = []
  currentImageUrl.value = 0
  await uploadAtfl.value.deleteAllFile()
}

const wkplLocClick = (e) => {
  e.preventDefault()

  // 아이콘 클릭 시 이벤트 무시
  if (e.target.tagName.toLowerCase() === 'i' || e.target.classList.contains('loc-icon')) {
    return
  }

  const rect = e.target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const wkplImg = e.currentTarget.querySelector('img')

  const relativeX = (((x - 10) / wkplImg.width) * 100).toFixed(3)
  const relativeY = (((y - 10) / wkplImg.height) * 100).toFixed(3)

  // 아이콘 wrapper div
  const iconWrapper = document.createElement('div')
  iconWrapper.className = 'loc-icon'
  iconWrapper.style.position = 'absolute'
  iconWrapper.style.left = `${relativeX}%`
  iconWrapper.style.top = `${relativeY}%`
  iconWrapper.style.backgroundColor = '#005eb8'
  iconWrapper.style.width = '20px'
  iconWrapper.style.height = '20px'
  iconWrapper.style.borderRadius = '50%'
  iconWrapper.style.display = 'flex'
  iconWrapper.style.alignItems = 'center'
  iconWrapper.style.justifyContent = 'center'
  // 신규 아이콘 식별 아이디 부여 (기등록된 아이콘은 wkpl_loc_id 가 아이콘 식별 아이디임)
  const iconId = 'icon-' + Date.now()
  iconWrapper.dataset.id = iconId

  const icon = document.createElement('i')
  icon.className = 'v-icon notranslate mdi mdi-map-marker theme--light'
  icon.style.color = 'white'
  iconWrapper.appendChild(icon)

  wkplImg.parentElement.style.position = 'relative'
  wkplImg.parentElement.appendChild(iconWrapper)

  emit('image-click', {
    id: iconId,
    x: relativeX,
    y: relativeY,
  })
}
const removeLocIcon = () => {
  const icons = wkplImage.value.querySelectorAll('div[data-id]')
  icons.forEach((icon) => icon.remove())
}

const setLocList = (data) => {
  locList.value = [...data]
}

defineExpose({
  initImages,
  saveAtfl,
  isExists,
  isChangeExists,
  setLocList,
  deleteAllFile,
})
</script>
<style>
.image-uploader-container {
  width: 100%;
}
</style>
