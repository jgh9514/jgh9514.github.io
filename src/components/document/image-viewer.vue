<template>
  <div>
    <viewer
      ref="viewer"
      :images="images"
      :class="['viewer', images.length > 0 ? 'pa-3' : 'not-image']"
      @inited="inited"
    >
      <v-row>
        <v-col
          v-for="(item, i) in images" :key="i" :src="item"
          cols="2"
        >
          <v-img
            :lazy-src="item"
            :src="item"
            aspect-ratio="1"
            class="bg-grey-lighten-2 cursor-pointer"
            cover
            @click="show(i)"
          />
        </v-col>
      </v-row>
    </viewer>
  </div>
</template>
<!-- Composition API -->
<script setup>
import 'viewerjs/dist/viewer.css'
import { component as Viewer, api as viewerApi } from 'v-viewer'

const currentImage = ref('0')
const atflNo = defineModel('atfl-no')
const images = ref([])

images.value = []

watch(atflNo, () => {
  search()
})

onMounted(() => {
  if (!$gfn_isEmpty(atflNo.value)) {
    search()
  }
})

const changeImage = (url) => {
  images.value.push(url)
  currentImage.value = images.value.length - 1
}

const initImages = () => {
  images.value = []
  currentImage.value = 0
}

const search = async () => {
  images.value = []
  const filelist = await $api.post(`/common/file/${atflNo.value}`, {})
  const tempImages = []
  for (const item of filelist) {
    tempImages.push(Constants.BASE_URL + '/common/file-down/image/' + item.atfl_no + '-' + item.atfl_sn)
  }
  images.value = tempImages
}

let $viewer = null
const inited = (viewer) => {
  $viewer = viewer
}

const show = (index) => {
  viewerApi({
    images: images.value,
    options: {
      initialViewIndex: index,
      movable: false,
    },
  })
}

defineExpose({
  changeImage,
  initImages,
})
</script>
<style>
.viewer {
  width: 100% !important;
  height: 100% !important;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.not-image {
  display: none;
}

.image-item {
  width: 100% !important;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
