<template>
  <div>
    <CommonSearchCondition v-model:sch-datas="schDatas" :page-id="usePageStore().getActivePage.page_id" />
  </div>
</template>

<script setup>
const pageStore = usePageStore()
const activePage = pageStore.getActivePage


const schDatas = ref({})
</script>
