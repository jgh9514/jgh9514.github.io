<template>
    <div>
        <dc-col-label>
        {{ item.label_nm }}
        </dc-col-label>
        <dc-col-value>
        <dc-input v-if="item.el_nm === 'text'" v-model="inputValue" :rules="rules" :variant="Constants.DC_VARIANT" />
        />
        <dc-select v-if="item.el_nm === 'select'" v-model="selectBoxValue" />
        </dc-col-value>
    </div>
</template>

<script setup>
//////////////////////////////////////////////////////
// Import 및 데이터 선언 영역
//////////////////////////////////////////////////////
defineProps({
  item: {
    type: Object,  // 또는 적절한 타입
    required: true
  }
})

//////////////////////////////////////////////////////
// Vue Life Cycle 영역
//////////////////////////////////////////////////////
onMounted(() => {})

//////////////////////////////////////////////////////
// 힘수 구현 영역
//////////////////////////////////////////////////////
// const select = async() => {
//     const result = await $api('/sample')
// }
</script>
  
  