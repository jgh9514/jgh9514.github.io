<template>
  <v-container fluid class="pa-4 max-w-[1400px]">
    <v-row>
      <!-- 방덱 정보 섹션 -->
      <v-col cols="12" lg="6">
        <v-card v-for="data in enemyData" :key="data.team_id" class="mb-4" elevation="2">
          <!-- 방덱 헤더 -->
          <v-card-title class="d-flex justify-space-between align-center bg-primary text-white">
            <span>점령전 방덱</span>
            <v-btn @click="goBack" color="white" variant="outlined" size="small">
              <v-icon start>mdi-arrow-left</v-icon>
              뒤로가기
            </v-btn>
          </v-card-title>
          
          <v-card-text class="pt-4">
            <!-- 몬스터 이미지 및 이름 -->
            <v-row class="mb-4">
              <v-col cols="4" class="text-center">
                <div class="relative">
                  <v-img
                    v-if="data.image_url1"
                    :src="`${Constants.BASE_URL}${data.image_url1}`"
                    max-width="120"
                    class="rounded border-[3px] border-[#d79f34] shadow-[0_4px_12px_rgba(215,159,52,0.3)] mx-auto block;"
                  />
                  <v-avatar
                    v-if="data.leader_icon"
                    size="30"
                    class="!absolute z-10 border-2 border-[#d79f34] bg-white/95 !rounded-none"
                    style="border-radius: 0 !important; bottom: -10px; left: -10px;"
                  >
                    <v-img 
                      :src="`${Constants.BASE_URL}${data.leader_icon}`"
                      :title="`${data.leader_type} ${data.leader_stat} +${data.leader_increase_by}%`"
                      class="!rounded-none"
                      style="border-radius: 0 !important;"
                    />
                  </v-avatar>
                </div>
                <p class="mt-2 mb-0 text-body-2 font-weight-medium">{{ data.m1_kr_name }}</p>
              </v-col>
              
              <v-col cols="4" class="text-center">
                <v-img
                  v-if="data.image_url2"
                  :src="`${Constants.BASE_URL}${data.image_url2}`"
                  max-width="120"
                  class="mx-auto rounded border-[3px] border-[#d79f34] shadow-[0_4px_12px_rgba(215,159,52,0.3)]"
                />
                <p class="mt-2 mb-0 text-body-2 font-weight-medium">{{ data.m2_kr_name }}</p>
              </v-col>
              
              <v-col cols="4" class="text-center">
                <v-img
                  v-if="data.image_url3"
                  :src="`${Constants.BASE_URL}${data.image_url3}`"
                  max-width="120"
                  class="mx-auto rounded border-[3px] border-[#d79f34] shadow-[0_4px_12px_rgba(215,159,52,0.3)]"
                />
                <p class="mt-2 mb-0 text-body-2 font-weight-medium">{{ data.m3_kr_name }}</p>
              </v-col>
            </v-row>
            
            <!-- 리더 스킬 정보 -->
            <v-alert
              v-if="data.leader_skill_description"
              type="info"
              variant="tonal"
              class="mb-4 rounded-none"
            >
              <strong>리더:</strong> {{ data.leader_skill_description }}
            </v-alert>
            
            <!-- 기본 정보 -->
            <div class="mb-4">
              <h4 class="mb-3 text-h6">기본 정보</h4>
              <v-row>
                <v-col cols="6" md="3">
                  <v-card variant="outlined" class="text-center pa-3">
                    <div class="text-h5 font-weight-bold text-primary">{{ data.total_rate }}%</div>
                    <div class="text-caption text-grey">공성률</div>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined" class="text-center pa-3">
                    <div class="text-h5 font-weight-bold text-primary">{{ data.total_count }}</div>
                    <div class="text-caption text-grey">총 게임 수</div>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined" class="text-center pa-3">
                    <div class="text-h5 font-weight-bold text-primary">{{ data.win_count }}</div>
                    <div class="text-caption text-grey">승리 수</div>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined" class="text-center pa-3">
                    <div class="text-h5 font-weight-bold text-primary">{{ data.lose_count }}</div>
                    <div class="text-caption text-grey">패배 수</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- 추천 공덱 섹션 -->
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center bg-primary text-white">
            <span>점령전 추천 공덱</span>
            <v-btn @click="add" color="white" variant="flat" size="small">추가</v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="recommendedTableHeaders"
            :items="recommendedList"
            hide-default-footer
            :items-per-page="-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td :style="{ padding: `${mobile ? '12px 8px' : '10px 3px'} !important` }">
                  <div class="d-flex align-center justify-center">
                    <div class="relative flex items-center justify-center">
                      <v-avatar
                        v-if="item.image_url1"
                        size="50"
                        class="me-0 border-2 border-[#d79f34]"
                      >
                        <v-img :src="`${Constants.BASE_URL}${item.image_url1}`" />
                      </v-avatar>
                      <v-avatar
                        v-if="item.leader_icon"
                        size="25"
                        class="!absolute z-10 border border-[#d79f34] bg-white/95 !rounded-none"
                        style="border-radius: 0 !important; bottom: -10px; left: -10px;"
                      >
                        <v-img 
                          :src="`${Constants.BASE_URL}${item.leader_icon}`"
                          :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                          class="!rounded-none"
                          style="border-radius: 0 !important;"
                        />
                      </v-avatar>
                    </div>
                    <v-avatar
                      v-if="item.image_url2"
                      size="50"
                      class="me-0 border-2 border-[#d79f34]"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url2}`" />
                    </v-avatar>
                    <v-avatar
                      v-if="item.image_url3"
                      size="50"
                      class="me-0 border-2 border-[#d79f34]"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url3}`" />
                    </v-avatar>
                  </div>
                </td>
                <td class="text-center" :style="{ padding: `${mobile ? '12px 8px' : '10px 3px'} !important` }">
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
          
          <!-- 추천 공덱 페이지네이션 -->
          <div v-if="recommendedTotalCount > 0 && recommendedTotalCount > recommendedLimit" class="pa-4 d-flex justify-center">
            <v-pagination
              v-model="recommendedPage"
              :length="Math.ceil(recommendedTotalCount / recommendedLimit)"
              :total-visible="mobile ? 3 : 7"
              :size="mobile ? 'small' : 'default'"
              @update:model-value="onRecommendedPageChange"
            />
          </div>
        </v-card>
      </v-col>
      
      <!-- 공격 이력 섹션 -->
      <v-col cols="12" lg="6">
        <v-card elevation="2">
          <v-card-title class="bg-primary text-white">점령전 공격 이력</v-card-title>
          
          <v-data-table
            :headers="tableHeaders"
            :items="historyList"
            hide-default-footer
            :items-per-page="-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td :style="{ padding: `${mobile ? '12px 8px' : '10px 3px'} !important` }">
                  <div class="d-flex align-center justify-center">
                    <div class="relative flex items-center justify-center">
                      <v-avatar
                        v-if="item.image_url1"
                        size="50"
                        class="me-0 border-2 border-[#d79f34]"
                      >
                        <v-img :src="`${Constants.BASE_URL}${item.image_url1}`" />
                      </v-avatar>
                      <v-avatar
                        v-if="item.leader_icon"
                        size="25"
                        class="!absolute z-10 border border-[#d79f34] bg-white/95 !rounded-none"
                        style="border-radius: 0 !important; bottom: -10px; left: -10px;"
                      >
                        <v-img 
                          :src="`${Constants.BASE_URL}${item.leader_icon}`"
                          :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                          class="!rounded-none"
                          style="border-radius: 0 !important;"
                        />
                      </v-avatar>
                    </div>
                    <v-avatar
                      v-if="item.image_url2"
                      size="50"
                      class="me-0 border-2 border-[#d79f34]"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url2}`" />
                    </v-avatar>
                    <v-avatar
                      v-if="item.image_url3"
                      size="50"
                      class="me-0 border-2 border-[#d79f34]"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url3}`" />
                    </v-avatar>
                  </div>
                </td>
                <td :style="{ padding: `${mobile ? '12px 8px' : '10px 3px'} !important` }">
                  <div class="pa-2">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="font-weight-bold text-primary">({{ item.total_rate }}%)</span>
                      <span class="text-caption text-grey">{{ item.win_count }}승 {{ item.lose_count }}패</span>
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
          
          <!-- 페이지네이션 -->
          <div v-if="historyTotalCount > 0 && historyTotalCount > historyLimit" class="pa-4 d-flex justify-center">
            <v-pagination
              v-model="historyPage"
              :length="Math.ceil(historyTotalCount / historyLimit)"
              :total-visible="mobile ? 3 : 7"
              :size="mobile ? 'small' : 'default'"
              @update:model-value="onHistoryPageChange"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- 추가 팝업 -->
    <addpopup ref="addpopupRef" @close="popClose" />
    
    <!-- 상세보기 팝업 -->
    <DeckDetailPopup ref="deckDetailPopupRef" />
  </v-container>
</template>

<script setup>
import addpopup from "@pages/addpopup.vue";
import DeckDetailPopup from "@pages/deck-detail-popup.vue";
import { useDisplay } from 'vuetify';

const urlParams = $gfn_getUrlParams();

// 모바일 여부 확인
const { mobile } = useDisplay();

const schData = ref({});
const enemyData = ref({});
const historyList = ref([]);
const recommendedList = ref([]);
const matchId = ref(null);

// 페이지네이션 변수
const historyPage = ref(1);
const historyLimit = ref(10);
const historyTotalCount = ref(0);

// 추천 공덱 페이지네이션 변수
const recommendedPage = ref(1);
const recommendedLimit = ref(5);
const recommendedTotalCount = ref(0);

const addpopupRef = ref(null);
const deckDetailPopupRef = ref(null);

// 테이블 헤더 정의
const tableHeaders = [
  {
    title: '공덱 리스트',
    key: 'monsters',
    align: 'center',
    width: '50%',
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

// 추천 공덱 섹션용 테이블 헤더
const recommendedTableHeaders = [
  {
    title: '공덱 리스트',
    key: 'monsters',
    align: 'center',
    width: '70%',
    sortable: false,
  },
  {
    title: '상세보기',
    key: 'detail',
    align: 'center',
    width: '30%',
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
  try {
    const searchData = {
      ...schData.value,
      match_id: matchId.value,
      historyLimit: historyLimit.value,
      historyOffset: historyPage.value,
      recommendedLimit: recommendedLimit.value,
      recommendedOffset: recommendedPage.value,
    };
    const res = await $api.post("/summonerswar/monster-detail-list", searchData);
    enemyData.value = res.enemyData;
    historyList.value = res.historyList || [];
    historyTotalCount.value =
      res.historyTotalCount || (res.historyList ? res.historyList.length : 0);
    recommendedList.value = res.recommendedList || [];
    recommendedTotalCount.value =
      res.recommendedTotalCount ||
      (res.recommendedList ? res.recommendedList.length : 0);

    // 디버깅용 로그
    console.log("페이지네이션 데이터:", {
      historyTotalCount: historyTotalCount.value,
      historyLimit: historyLimit.value,
      recommendedTotalCount: recommendedTotalCount.value,
      recommendedLimit: recommendedLimit.value,
    });
  } catch (error) {
    console.error("몬스터 상세 조회 실패:", error);
    $toast("몬스터 상세 정보를 불러오는데 실패했습니다.", "error");
    enemyData.value = null;
    historyList.value = [];
    recommendedList.value = [];
    historyTotalCount.value = 0;
    recommendedTotalCount.value = 0;
  }
};

const onHistoryPageChange = (page) => {
  historyPage.value = page;
  search();
};

const onRecommendedPageChange = (page) => {
  recommendedPage.value = page;
  search();
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
  deckDetailPopupRef.value.open(item);
};

const popClose = () => {
  search();
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
</script>
