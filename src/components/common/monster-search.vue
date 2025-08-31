<template>
  <div class="monster-search-container component-container">
    <div class="search-row">
      <div class="search-input-col">
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
      <div class="search-button-col">
        <v-btn @click="handleSearch" class="search-btn">검색</v-btn>
      </div>
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

.search-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: nowrap;
  max-width: 600px;
}

.search-input-col {
  flex: 1;
  min-width: 0;
}

.search-button-col {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.search-card {
  width: 100%;
  min-width: 300px;
  height: 54px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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
  border-radius: 0;
}

.search-btn {
  height: 54px;
  min-width: 80px;
  white-space: nowrap;
  border-radius: 0 4px 4px 0;
  border-left: none;
}

.v-list-item--active {
  background: #f00 !important;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .monster-search-container {
    padding: 12px;
  }
  
  .search-row {
    gap: 8px;
    max-width: none;
  }
  
  .search-input-col {
    min-width: 200px;
  }
  
  .search-button-col {
    flex-shrink: 0;
  }
  
  .search-btn {
    min-width: 60px;
    border-radius: 4px;
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }
  
  .search-card {
    min-width: 200px;
    border-radius: 4px;
  }
}
</style>
