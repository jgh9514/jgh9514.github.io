<template>
  <div class="dc_bottom_btn">
    <div class="right_tab">
      <template v-for="i in 20" :key="i">
        <dc-btn v-if="i === 5 && buttonList.includes('save')" :label="$t('저장')" @click="save" />
        <dc-btn v-if="i === 10 && buttonList.includes('remove')" label="삭제" @click="remove" />
        <dc-btn v-if="i === 20 && buttonList.includes('list')" type="border" :label="$t('목록')" @click="goList" />
        <dc-btn v-if="i === 25 && buttonList.includes('close')" type="border" :label="$t('닫기')" @click="close" />
        <slot v-else :name="i" />
      </template>
    </div>
  </div>
</template>
<script setup>
//////////////////////////////////////////////////////
// Import 및 데이터 선언 영역
//////////////////////////////////////////////////////
const buttonList = defineModel('buttonList')

// 순서대로 25, 50, 75, 100 의 슬롯을 차지하고 있음.
const emit = defineEmits(['save', 'goList', 'close', 'remove'])

//////////////////////////////////////////////////////
// 힘수 구현 영역
//////////////////////////////////////////////////////
const save = () => {
  emit('save')
}

const goList = () => {
  emit('goList')
}

const close = () => {
  emit('close')
}

const remove = () => {
  emit('remove')
}

const getButton = (type) => {
  return defaultButtons.find((btn) => btn.type === type)
}

const defaultButtons = [
  {
    type: 'remove',
    label: '삭제',
    class: 'btn-primary',
    action: remove,
  },
  {
    type: 'save',
    label: '저장',
    class: 'btn-primary',
    action: save,
  },
  {
    type: 'list',
    label: '목록',
    class: 'btn-black',
    action: goList,
  },
  {
    type: 'close',
    label: '닫기',
    class: 'btn-black',
    action: close,
  },
]
</script>
