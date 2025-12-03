<template>
  <v-bottom-sheet
    v-model="dialog"
    inset
    persistent
    :scrim="true"
    class="add-deck-sheet"
  >
    <v-card class="sheet-card">
      <v-card-title class="sheet-header">
        <div class="d-flex align-center justify-space-between w-100">
          <h3 class="header-title">점령전 {{ type == 1 ? "방덱" : "공덱" }} 추가 - {{ step === 1 ? '몬스터 선택' : '스펙 입력' }}</h3>
          <v-btn 
            icon
            variant="text"
            @click="close"
            color="white"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      
      <v-card-text class="sheet-content">
        <!-- Step 1: 몬스터 선택 -->
        <div v-if="step === 1">
          <!-- 선택된 몬스터 표시 -->
          <div class="selected-monsters">
            <h4>선택된 몬스터 ({{ selectedMonsterList.length }}/3)</h4>
            <div class="monster-slots">
              <div 
                v-for="(slot, index) in 3" 
                :key="index"
                class="monster-slot"
                :class="{ 'leader': index === 0 }"
              >
                <img
                  v-if="selectedMonsterList[index]"
                  :src="`${Constants.BASE_URL}${selectedMonsterList[index].image_url}`"
                  @click="removeMonster(index)"
                  class="selected-monster-img"
                />
                <img
                  v-else
                  :src="`${Constants.BASE_URL}/images/unit_select_icon.png`"
                  class="empty-slot-img"
                />
                <div v-if="index === 0" class="leader-label">Leader</div>
              </div>
            </div>
          </div>

          <!-- 몬스터 검색 -->
          <div class="monster-search-section">
            <h4>몬스터 검색</h4>
            <v-autocomplete
              ref="autoInput"
              v-model="selectedMonsterIds"
              v-model:search="searchInput"
              :items="monsterList"
              color="primary"
              :item-title="(item) => `${item.kr_name} ${item.un_name} ${item.modified_kr_name}`"
              item-value="monster_id"
              chips
              closable-chips
              multiple
              hide-details
              placeholder="몬스터 선택"
              @update:model-value="handleMonsterChange"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="`${Constants.BASE_URL}${item.raw.image_url}`"
                  :text="item.raw.kr_name"
                  @click:close="removeMonster(item.raw.monster_id)"
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
          </div>
        </div>

        <!-- Step 2: 스펙 입력 -->
        <div v-if="step === 2" class="stats-section">
          <v-expansion-panels v-model="expandedPanel" multiple>
            <v-expansion-panel
              v-for="(monster, index) in selectedMonsterList"
              :key="monster.monster_id"
              :value="index"
            >
              <v-expansion-panel-title>
                <div class="monster-header">
                  <img
                    :src="`${Constants.BASE_URL}${monster.image_url}`"
                    class="monster-avatar"
                  />
                  <div class="monster-info">
                    <div class="monster-name">
                      {{ monster.kr_name }}
                      <v-chip v-if="index === 0" size="x-small" color="warning" class="ms-2">리더</v-chip>
                    </div>
                    <div class="monster-subname">{{ monster.un_name }}</div>
                  </div>
                </div>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text>
                <div class="stats-form">
                  <v-row dense>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].hp"
                        label="체력 (HP)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].atk"
                        label="공격력 (ATK)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].def"
                        label="방어력 (DEF)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].spd"
                        label="공격속도 (SPD)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].critRate"
                        label="치명타 확률 (%)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].critDmg"
                        label="치명타 피해 (%)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].resistance"
                        label="효과 저항 (%)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model.number="monsterStats[index].accuracy"
                        label="효과 적중 (%)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>

      <v-card-actions class="action-buttons-footer">
        <v-btn 
          v-if="step === 2"
          variant="outlined"
          @click="goToStep1"
          class="back-btn"
          size="large"
        >
          <v-icon class="me-1">mdi-chevron-left</v-icon>
          이전
        </v-btn>
        <v-spacer />
        <v-btn 
          v-if="step === 1"
          color="primary" 
          variant="elevated" 
          @click="goToStep2"
          class="next-btn"
          size="large"
          :disabled="selectedMonsterList.length !== 3"
        >
          다음
          <v-icon class="ms-1">mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn 
          v-if="step === 2"
          color="primary" 
          variant="elevated" 
          @click="save"
          class="save-btn"
          size="large"
        >
          저장
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
const type = ref(0);
const defense_monster = ref("");
const dialog = ref(false);
const monsterList = ref([]);
const selectedMonsterList = ref([]);
const selectedMonsterIds = ref([]);
const step = ref(1);
const expandedPanel = ref([0, 1, 2]);
const searchInput = ref('');
const autoInput = ref(null);

// 각 몬스터의 스펙 데이터
const monsterStats = ref([
  { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 },
  { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 },
  { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 }
]);

const emit = defineEmits(["close"]);

const open = async (openType, id) => {
  if (openType === "bang") {
    type.value = 1;
  } else if (openType === "empty") {
    type.value = 2;
    defense_monster.value = id;
    console.log(defense_monster.value);
  }
  step.value = 1;
  dialog.value = true;
  await search();
};

const search = async () => {
  try {
    const res = await $api.post("/summonerswar/monster-list", {});
    monsterList.value = Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("몬스터 목록 조회 실패:", error);
    monsterList.value = [];
    $toast("몬스터 목록을 불러오는데 실패했습니다.", "error");
  }
};

// 최대 3개 선택 제한
watchEffect(() => {
  if (selectedMonsterIds.value.length > 3) {
    $toast("최대 3개까지 선택할 수 있습니다.", "error");
    selectedMonsterIds.value = selectedMonsterIds.value.slice(0, 3);
  }
});

// 몬스터 선택 처리
const handleMonsterChange = (monsterIds) => {
  // selectedMonsterList 업데이트
  selectedMonsterList.value = monsterIds.map(id => 
    monsterList.value.find(monster => monster.monster_id === id)
  ).filter(Boolean);
};

// 아이템 클릭 시 드롭다운 닫기
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

// 몬스터 제거
const removeMonster = (monsterId) => {
  // ID 배열에서 제거
  if (typeof monsterId === 'number') {
    selectedMonsterIds.value = selectedMonsterIds.value.filter((id) => id !== monsterId);
  } else {
    // 인덱스로 제거 (슬롯에서 클릭한 경우)
    const index = monsterId;
    const monsterToRemove = selectedMonsterList.value[index];
    if (monsterToRemove) {
      selectedMonsterIds.value = selectedMonsterIds.value.filter(
        (id) => id !== monsterToRemove.monster_id
      );
    }
  }
};

// 스텝 이동
const goToStep2 = () => {
  if (selectedMonsterList.value.length !== 3) {
    $toast("3개의 몬스터를 선택해주세요.", "error");
    return;
  }
  step.value = 2;
};

const goToStep1 = () => {
  step.value = 1;
};

const save = async () => {
  if (selectedMonsterList.value.length !== 3) {
    $toast($t("몬스터를 선택해주세요."), "error");
    return;
  }

  const saveData = {
    type: type.value,
    def_monster_1: defense_monster.value.dm1,
    def_monster_2: defense_monster.value.dm2,
    def_monster_3: defense_monster.value.dm3,
    atk_monster_1: selectedMonsterList.value[0].monster_id,
    atk_monster_2: selectedMonsterList.value[1].monster_id,
    atk_monster_3: selectedMonsterList.value[2].monster_id,
    // 몬스터 스펙 추가
    monster_1_stats: monsterStats.value[0],
    monster_2_stats: monsterStats.value[1],
    monster_3_stats: monsterStats.value[2],
  };

  try {
    const res = await $api.post("/summonerswar/enemyTeam-save", saveData);
    if (res === "SUCCESS") {
      $toast($t("저장되었습니다."), "success");
      close();
    } else {
      $toast($t("저장에 실패했습니다."), "error");
    }
  } catch (error) {
    console.error("공덱 저장 실패:", error);
    $toast($t("저장 중 오류가 발생했습니다."), "error");
  }
};

const close = () => {
  selectedMonsterList.value = [];
  selectedMonsterIds.value = [];
  step.value = 1;
  // 스펙 데이터 초기화
  monsterStats.value = [
    { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 },
    { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 },
    { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 }
  ];
  dialog.value = false;
  emit("close");
};

defineExpose({
  open,
});
</script>

<style scoped>
.add-deck-sheet {
  z-index: 2000;
}

.sheet-card {
  border-radius: 16px 16px 0 0;
  max-height: 80vh;
  overflow: hidden;
}

.sheet-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px !important;
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
  flex: 1;
}

.action-buttons-footer {
  padding: 16px 20px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.back-btn,
.next-btn,
.save-btn {
  font-weight: 600;
}

.sheet-content {
  padding: 20px;
  max-height: calc(80vh - 160px);
  overflow-y: auto;
}

/* 선택된 몬스터 섹션 */
.selected-monsters {
  margin-bottom: 24px;
}

.selected-monsters h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.monster-slots {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.monster-slot {
  position: relative;
  width: 80px;
  height: 80px;
  background: #574424;
  border: 4px solid #6d5424;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.monster-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.monster-slot.leader {
  border-color: #d79f34;
  box-shadow: 0 0 0 2px rgba(215, 159, 52, 0.3);
}

.selected-monster-img,
.empty-slot-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.leader-label {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #d79f34;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-shadow: -1px 0 #2c1f11, 0 1px #2c1f11, 1px 0 #2c1f11, 0 -1px #2c1f11;
}

/* 몬스터 검색 섹션 */
.monster-search-section {
  margin-bottom: 20px;
}

.monster-search-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

/* 스펙 입력 섹션 */
.stats-section {
  width: 100%;
}

.monster-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.monster-avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.monster-info {
  flex: 1;
}

.monster-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

.monster-subname {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.stats-form {
  padding: 8px 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .sheet-content {
    padding: 16px;
  }
  
  .monster-slots {
    gap: 8px;
  }
  
  .monster-slot {
    width: 70px;
    height: 70px;
  }
  
  .selected-monster-img,
  .empty-slot-img {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .monster-slots {
    gap: 6px;
  }
  
  .monster-slot {
    width: 60px;
    height: 60px;
  }
  
  .selected-monster-img,
  .empty-slot-img {
    width: 40px;
    height: 40px;
  }
}
</style>
