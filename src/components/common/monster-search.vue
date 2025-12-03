<template>
  <div>
    <!-- 검색 입력 -->
    <v-autocomplete
      ref="autoInput"
      v-model="selectMonster"
      v-model:search="searchInput"
      :items="monsterNameList"
      color="primary"
      :item-title="(item) => `${item.kr_name} ${item.un_name} ${item.modified_kr_name}`"
      item-value="monster_id"
      chips
      closable-chips
      multiple
      hide-details
      placeholder="몬스터 선택 (최대 3개)"
    >
      <template v-slot:chip="{ props, item }">
        <v-chip
          v-bind="props"
          :prepend-avatar="`${Constants.BASE_URL}${item.raw.image_url}`"
          :text="item.raw.kr_name"
          @click:close="remove(item.raw.monster_id)"
        ></v-chip>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="`${Constants.BASE_URL}${item.raw.image_url}`"
          :title="item.raw.kr_name"
          :subtitle="`${item.raw.un_name} (${item.raw.modified_kr_name})`"
          @click="handleItemClick"
        ></v-list-item>
      </template>
    </v-autocomplete>

    <!-- 검색 버튼 -->
    <v-btn 
      v-if="!compact"
      @click="handleSearch"
      color="primary"
      size="large"
      block
      class="search-btn mt-4"
      :disabled="selectMonster.length === 0"
    >
      <v-icon class="me-2">mdi-magnify</v-icon>
      검색하기
      <v-chip 
        v-if="selectMonster.length > 0"
        class="ms-2"
        size="small"
        color="white"
        variant="flat"
      >
        {{ selectMonster.length }}/3
      </v-chip>
    </v-btn>
  </div>
</template>

<script setup>
import { Constants } from '~/utils/constants';

const props = defineProps({
  monsterNameList: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['search', 'update:modelValue']);

const selectMonster = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const searchInput = ref('');
const autoInput = ref(null);

// 최대 3개 선택 제한
watch(() => props.modelValue, (newValue) => {
  if (newValue.length > 3) {
    $toast("최대 3개까지 선택할 수 있습니다.", "error");
    emit('update:modelValue', newValue.slice(0, 3));
  }
});

const handleSearch = () => {
  emit('search', selectMonster.value);
};

const handleItemClick = () => {
  // 입력값 초기화
  searchInput.value = '';
  
  // 메뉴 슬롯 닫기 (모바일 환경 대응)
  if (autoInput.value) {
    autoInput.value.blur();
    setTimeout(() => {
      autoInput.value?.focus();
    }, 500);
  }
};

const remove = (monster_id) => {
  const filtered = selectMonster.value.filter((e) => e !== monster_id);
  emit('update:modelValue', filtered);
};
</script>

<style scoped>
.search-btn {
  border-radius: 8px;
  font-weight: 600;
}
</style>
