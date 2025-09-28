<template>
  <div class="monster-search-container component-container">
    <div class="search-input-section">
      <v-card color="blue-grey-darken-1" class="search-card">
        <v-autocomplete
          v-model="selectMonster"
          :items="monsterNameList"
          color="blue-grey-lighten-2"
          :item-title="(item) => `${item.kr_name} ${item.un_name} ${item.modified_kr_name}`"
          item-value="monster_id"
          chips
          closable-chips
          multiple
          hide-details
          clear-on-select
          placeholder="몬스터 선택"
          @update:model-value="handleMonsterChange"
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
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-card>
    </div>
    <div class="search-button-section">
      <v-btn @click="handleSearch" class="search-btn">검색</v-btn>
    </div>
  </div>
</template>

<script setup>
import { Constants } from '~/utils/constants';

const props = defineProps({
  monsterNameList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['search', 'monster-change']);

const selectMonster = ref([]);



// 최대 3개 선택 제한
watchEffect(() => {
  if (selectMonster.value.length > 3) {
    $toast("최대 3개까지 선택할 수 있습니다.", "error");
    selectMonster.value = selectMonster.value.slice(0, 3);
  }
});

const handleSearch = () => {
  emit('search', selectMonster.value);
};

const handleMonsterChange = (value) => {
  emit('monster-change', value);
};

const remove = (monster_id) => {
  selectMonster.value = selectMonster.value.filter((e) => e !== monster_id);
  emit('monster-change', selectMonster.value);
};

// 외부에서 선택된 몬스터 설정 가능
const setSelectedMonsters = (monsters) => {
  selectMonster.value = [...monsters];
};

// 선택된 몬스터 반환
const getSelectedMonsters = () => {
  return [...selectMonster.value];
};

// 외부에서 접근 가능한 메서드들
defineExpose({
  setSelectedMonsters,
  getSelectedMonsters
});
</script>

<style scoped>
.monster-search-container {
  padding: 16px;
  max-width: 100%;
  overflow: visible;
}

.search-input-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 12px;
}

.search-button-section {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.search-card {
  width: 100%;
  min-width: 300px;
  height: 54px;
  border-radius: 4px;
}

.search-card .v-card__content {
  padding: 0;
  height: 100%;
}

.search-card .v-autocomplete {
  height: 100%;
}

.search-card .v-field {
  height: 100%;
  border-radius: 4px;
}

.search-btn {
  height: 54px;
  width: 100%;
  white-space: nowrap;
  border-radius: 4px;
}

.v-list-item--active {
  background: #f00 !important;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .monster-search-container {
    padding: 12px;
  }
  
  .search-input-section {
    max-width: none;
    margin-bottom: 8px;
  }
  
  .search-button-section {
    max-width: none;
  }
  
  .search-btn {
    width: 100%;
    border-radius: 4px;
  }
  
  .search-card {
    min-width: 200px;
    border-radius: 4px;
  }
}
</style>
