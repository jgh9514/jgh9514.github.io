<template>
  <div class="detail-page">
    <!-- 방덱 정보 섹션 -->
    <div v-for="data in enemyData" :key="data.team_id" class="defense-section">
      <div class="section-header">
        <h3>점령전 방덱</h3>
        <v-btn @click="goBack" color="white" variant="outlined" class="back-btn">
          <v-icon>mdi-arrow-left</v-icon>
          뒤로가기
        </v-btn>
      </div>
      
      <!-- 몬스터 이미지 및 이름 -->
      <div class="monster-grid">
        <div class="monster-item">
          <div class="monster-image-container">
            <img
              v-if="data.image_url1"
              :src="`${Constants.BASE_URL}${data.image_url1}`"
              class="monster-image"
              alt="몬스터 1"
            />
            <div v-if="data.leader_icon" class="leader-badge">
              <img 
                :src="`${Constants.BASE_URL}${data.leader_icon}`" 
                class="leader-icon"
                :title="`${data.leader_type} ${data.leader_stat} +${data.leader_increase_by}%`"
              />
            </div>
          </div>
          <p class="monster-name">{{ data.m1_kr_name }}</p>
        </div>
        
        <div class="monster-item">
          <img
            v-if="data.image_url2"
            :src="`${Constants.BASE_URL}${data.image_url2}`"
            class="monster-image"
            alt="몬스터 2"
          />
          <p class="monster-name">{{ data.m2_kr_name }}</p>
        </div>
        
        <div class="monster-item">
          <img
            v-if="data.image_url3"
            :src="`${Constants.BASE_URL}${data.image_url3}`"
            class="monster-image"
            alt="몬스터 3"
          />
          <p class="monster-name">{{ data.m3_kr_name }}</p>
        </div>
      </div>
      
      <!-- 리더 스킬 정보 -->
      <div v-if="data.leader_skill_description" class="leader-skill-section">
        <div class="leader-skill-info">
          <strong>리더:</strong> {{ data.leader_skill_description }}
        </div>
      </div>
      
      <!-- 기본 정보 -->
      <div class="stats-section">
        <h4>기본 정보</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ data.total_rate + "%" }}</span>
            <span class="stat-label">공성률</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ data.total_count }}</span>
            <span class="stat-label">총 게임 수</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ data.win_count }}</span>
            <span class="stat-label">승리 수</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ data.lose_count }}</span>
            <span class="stat-label">패배 수</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 추천 공덱 섹션 -->
    <div class="recommended-section">
      <div class="section-header">
        <h3>점령전 추천 공덱</h3>
        <v-btn @click="add" color="white" variant="filled" class="add-btn">추가</v-btn>
      </div>
      
      <v-data-table
        :headers="tableHeaders"
        :items="recommendedList"
        hide-default-footer
        :items-per-page="200"
        class="custom-table"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <div class="monster-images">
                <div class="monster-image-container">
                  <img
                    v-if="item.image_url1"
                    :src="`${Constants.BASE_URL}${item.image_url1}`"
                    class="monster-image-small"
                  />
                  <div v-if="item.leader_icon" class="leader-badge-small">
                    <img 
                      :src="`${Constants.BASE_URL}${item.leader_icon}`" 
                      class="leader-icon-small"
                      :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                    />
                  </div>
                </div>
                <img
                  v-if="item.image_url2"
                  :src="`${Constants.BASE_URL}${item.image_url2}`"
                  class="monster-image-small"
                />
                <img
                  v-if="item.image_url3"
                  :src="`${Constants.BASE_URL}${item.image_url3}`"
                  class="monster-image-small"
                />
              </div>
            </td>
            <td class="text-center">
              <v-btn
                size="small"
                color="primary"
                variant="outlined"
                @click="showDetail(item)"
              >
                상세보기
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    
    <!-- 공격 이력 섹션 -->
    <div class="history-section">
      <div class="section-header">
        <h3>점령전 공격 이력</h3>
      </div>
      
      <v-data-table
        :headers="tableHeaders"
        :items="historyList"
        hide-default-footer
        :items-per-page="200"
        class="custom-table"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <div class="monster-images">
                <div class="monster-image-container">
                  <img
                    v-if="item.image_url1"
                    :src="`${Constants.BASE_URL}${item.image_url1}`"
                    class="monster-image-small"
                  />
                  <div v-if="item.leader_icon" class="leader-badge-small">
                    <img 
                      :src="`${Constants.BASE_URL}${item.leader_icon}`" 
                      class="leader-icon-small"
                      :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                    />
                  </div>
                </div>
                <img
                  v-if="item.image_url2"
                  :src="`${Constants.BASE_URL}${item.image_url2}`"
                  class="monster-image-small"
                />
                <img
                  v-if="item.image_url3"
                  :src="`${Constants.BASE_URL}${item.image_url3}`"
                  class="monster-image-small"
                />
              </div>
            </td>
            <td>
              <div class="win-rate-info">
                <div class="win-rate-header">
                  <span class="win-rate-text">({{ item.total_rate + "%" }})</span>
                  <span class="win-loss-text">{{ item.win_count }}승 {{ item.lose_count }}패</span>
                </div>
                <v-progress-linear
                  :model-value="item.total_rate"
                  color="primary"
                  height="8"
                  rounded
                />
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    
    <!-- 추가 팝업 -->
    <addpopup ref="addpopupRef" @close="popClose" />
    
    <!-- 상세보기 팝업 -->
    <v-dialog v-model="showDetailPopup" max-width="800" persistent>
      <v-card class="detail-popup">
        <v-card-title class="popup-header">
          <span>추천 공덱 상세정보</span>
          <v-btn icon @click="closeDetailPopup" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text v-if="selectedItem" class="popup-content">
          <!-- 공덱 구성 이미지 -->
          <div class="popup-monster-images">
            <h4>공덱 구성</h4>
            <div class="monster-images">
              <img
                v-if="selectedItem.image_url1"
                :src="`${Constants.BASE_URL}${selectedItem.image_url1}`"
                class="popup-monster-image"
              />
              <img
                v-if="selectedItem.image_url2"
                :src="`${Constants.BASE_URL}${selectedItem.image_url2}`"
                class="popup-monster-image"
              />
              <img
                v-if="selectedItem.image_url3"
                :src="`${Constants.BASE_URL}${selectedItem.image_url3}`"
                class="popup-monster-image"
              />
            </div>
          </div>
          
          <!-- 몬스터별 상세 정보 -->
          <MonsterDetailCard 
            v-for="(monster, index) in getMonsterDetails(selectedItem)"
            :key="index"
            :monster="monster"
            :monster-index="index + 1"
          />
        </v-card-text>
        
        <v-card-actions class="popup-actions">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDetailPopup">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import addpopup from "@pages/addpopup.vue";
import MonsterDetailCard from "~/components/common/monster-detail-card.vue";
import { useSearchStateStore } from '~/stores/search-state';

const route = useRoute();
const searchStateStore = useSearchStateStore();
const urlParams = $gfn_getUrlParams();

const schData = ref({});
const enemyData = ref({});
const historyList = ref([]);
const recommendedList = ref([]);
const matchId = ref(null);

const addpopupRef = ref(null);
const selectedItem = ref(null);
const showDetailPopup = ref(false);

// 테이블 헤더 정의
const tableHeaders = [
  {
    title: '공덱 리스트',
    key: 'monsters',
    align: 'center',
    width: '40%',
    sortable: false,
  },
  {
    title: '승률',
    key: 'total_rate',
    align: 'center',
    width: '50%',
    sortable: false,
  },
];

onMounted(async () => {
  const detailParam = urlParams.detail;
  
  // detail 파라미터에 _가 있으면 monster-key_match-id 형태
  if (detailParam.includes('_')) {
    const parts = detailParam.split('_');
    const monsterKey = parts[0];
    const matchIdPart = parts[1];
    
    // monster-key를 다시 -로 분리
    const dm = monsterKey.split("-");
    schData.value.dm1 = dm[0];
    schData.value.dm2 = dm[1];
    schData.value.dm3 = dm[2];
    
    // match_id 설정
    matchId.value = matchIdPart;
  } else {
    // 일반 형태: monster-key만 있음
    const dm = detailParam.split("-");
    schData.value.dm1 = dm[0];
    schData.value.dm2 = dm[1];
    schData.value.dm3 = dm[2];
  }
  
  await search();
});

const search = async () => {
    const searchData = { ...schData.value, match_id: matchId.value };
    const res = await $api.post("/summonerswar/monster-detail-list", searchData);
    enemyData.value = res.enemyData;
    historyList.value = res.historyList;
    recommendedList.value = res.recommendedList;
};

const add = () => {
  const teamData = {
    dm1: schData.value.dm1,
    dm2: schData.value.dm2,
    dm3: schData.value.dm3,
  };
  addpopupRef.value.open("empty", teamData);
};

const showDetail = (item) => {
  selectedItem.value = item;
  showDetailPopup.value = true;
};

const popClose = () => {
  search();
};

const closeDetailPopup = () => {
  showDetailPopup.value = false;
  selectedItem.value = null;
};

const goBack = () => {
  // store에 저장된 검색 상태를 유지한 채로 siege 페이지로 이동
  let siegePath = '/siege';
  
  // match_id가 있으면 siege 경로에 추가
  if (matchId.value) {
    siegePath += `/${matchId.value}`;
  }
  
  navigateTo(siegePath);
};

// 몬스터 상세 정보 추출
const getMonsterDetails = (item) => {
  const monsters = [];
  
  for (let i = 1; i <= 3; i++) {
    const monster = {
      name: item[`m${i}_kr_name`],
      runeSet: item[`m${i}_rune_set`] || item.rune_set || '정보 없음',
      rune2: item[`m${i}_rune_2`] || item.rune_2 || '정보 없음',
      stats: {
        hp: { base: item[`m${i}_hp_base`] || item.hp_base || 0, plus: item[`m${i}_hp_plus`] || item.hp_plus },
        atk: { base: item[`m${i}_atk_base`] || item.atk_base || 0, plus: item[`m${i}_atk_plus`] || item.atk_plus },
        def: { base: item[`m${i}_def_base`] || item.def_base || 0, plus: item[`m${i}_def_plus`] || item.def_plus },
        spd: { base: item[`m${i}_spd_base`] || item.spd_base || 0, plus: item[`m${i}_spd_plus`] || item.spd_plus },
        cr: { base: item[`m${i}_cr_base`] || item.cr_base || 0, plus: item[`m${i}_cr_plus`] || item.cr_plus },
        cd: { base: item[`m${i}_cd_base`] || item.cd_base || 0, plus: item[`m${i}_cd_plus`] || item.cd_plus },
        res: { base: item[`m${i}_res_base`] || item.res_base || 0, plus: item[`m${i}_res_plus`] || item.res_plus },
        acc: { base: item[`m${i}_acc_base`] || item.acc_base || 0, plus: item[`m${i}_acc_plus`] || item.acc_plus },
      }
    };
    
    if (monster.name) {
      monsters.push(monster);
    }
  }
  
  return monsters;
};
</script>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 섹션 공통 스타일 */
.defense-section,
.recommended-section,
.history-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.back-btn {
  color: #333 !important;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.add-btn {
  color: #333 !important;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

/* 몬스터 그리드 */
.monster-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
}

.monster-item {
  text-align: center;
}

.monster-image-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.monster-image {
  width: 100%;
  max-width: 120px;
  height: auto;
  border-radius: 12px;
  border: 3px solid #d79f34;
  box-shadow: 0 4px 12px rgba(215, 159, 52, 0.3);
}

.monster-image-small {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: 2px solid #d79f34;
  margin-right: 8px;
  object-fit: cover;
}

.monster-name {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 리더 배지 */
.leader-badge {
  position: absolute;
  bottom: -10px;
  left: -10px;
  z-index: 10;
}

.leader-badge-small {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.leader-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #d79f34;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 리더 스킬 섹션 */
.leader-skill-section {
  padding: 0 10px 24px;
}

.leader-skill-info {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}

/* 통계 섹션 */
.stats-section {
  padding: 0 10px 24px;
}

.stats-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 몬스터 이미지 그룹 */
.monster-images {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 테이블 스타일 */

.custom-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  overflow: hidden;
}

.custom-table :deep(.v-data-table-header) {
  background: #f8f9fa;
}

.custom-table :deep(.v-data-table__tr) {
  height: 80px;
}

.custom-table :deep(.v-data-table__td) {
  padding: 16px 0 !important;
}

/* 승률 정보 */
.win-rate-info {
  padding: 8px;
}

.win-rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.win-rate-text {
  font-weight: 600;
  color: #667eea;
}

.win-loss-text {
  font-size: 12px;
  color: #6c757d;
}

/* 팝업 스타일 */
.detail-popup {
  border-radius: 12px;
}

.popup-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
}

.close-btn {
  color: white;
}

.popup-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.popup-monster-images {
  margin-bottom: 24px;
}

.popup-monster-images h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.popup-monster-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #d79f34;
  margin-right: 12px;
  object-fit: cover;
}

.popup-actions {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .detail-page {
    padding: 16px;
  }
  
  .monster-grid {
    gap: 16px;
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .section-header {
    padding: 16px;
    gap: 12px;
    text-align: center;
  }
  
  .monster-image {
    max-width: 100px;
  }
}
</style>
