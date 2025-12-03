<template>
  <v-container fluid class="page-container pa-0">
    <!-- 타이틀 헤더 -->
    <div class="title-section">
      <v-container class="py-3 py-md-4">
        <div class="d-flex align-center mb-1 mb-md-2">
          <v-icon 
            icon="mdi-castle"
            :size="mobile ? 28 : 32" 
            color="primary" 
            class="me-2 me-md-3"
          />
          <div>
            <h1 
              class="font-weight-bold mb-0"
              :class="mobile ? 'text-h6' : 'text-h5'"
            >
              길드 공성전 방어덱 분석
            </h1>
            <p 
              class="text-grey-darken-1 mb-0 mt-1"
              :class="mobile ? 'text-caption' : 'text-body-2'"
            >
              검색 조건에 맞는 방어덱의 승률과 전적을 확인하세요
            </p>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="content-section">
      <!-- 길드 선택 섹션 -->
      <v-card v-if="availableGuilds.length > 0" class="mb-3 mb-md-4 section-card" elevation="3">
        <v-card-title class="section-header pa-3 pa-md-4">
          <v-icon icon="mdi-account-group" class="me-2" :size="mobile ? 20 : 22" />
          <span :class="mobile ? 'text-subtitle-2' : 'text-subtitle-1'">상대 길드 선택</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <v-row no-gutters>
            <v-col 
              v-for="guild in availableGuilds" 
              :key="guild.guild_name"
              cols="12" 
              sm="6"
              md="3"
            >
              <div 
                class="guild-item"
                :class="{ 'guild-item-selected': selectedGuilds.includes(guild.guild_name) }"
                @click="toggleGuildSelection(guild.guild_name)"
              >
                <v-checkbox
                  v-model="selectedGuilds"
                  :value="guild.guild_name"
                  color="primary"
                  hide-details
                  :density="mobile ? 'compact' : 'default'"
                  class="me-3"
                  @click.stop
                  @change="onGuildSelectionChange"
                />
                <div class="flex-grow-1">
                  <div 
                    class="font-weight-bold guild-name"
                    :class="mobile ? 'text-body-2' : 'text-subtitle-2'"
                  >
                    {{ guild.guild_name }}
                  </div>
                  <div 
                    class="text-medium-emphasis guild-rating"
                    :class="mobile ? 'text-caption' : 'text-body-2'"
                  >
                    {{ guild.rating }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 데스크톱 몬스터 검색 -->
      <v-card v-if="!mobile" class="mb-3 mb-md-4 section-card" elevation="3">
        <v-card-title class="section-header pa-3 pa-md-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-magnify" class="me-2" size="20" />
            <span class="text-subtitle-1">몬스터 검색</span>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-3 pa-md-4">
          <v-row align="center" no-gutters>
            <v-col cols="12" md="9" class="pr-md-3">
              <MonsterSearch 
                v-model="selectMonster"
                :monster-name-list="monsterNameList"
                @search="handleSearch"
                ref="monsterSearchRef"
                :compact="true"
              />
            </v-col>
            <v-col cols="12" md="3" class="mt-3 mt-md-0">
              <div class="d-flex flex-column" style="gap: 8px;">
                <v-btn 
                  @click="handleSearch"
                  color="primary"
                  :size="mobile ? 'default' : 'small'"
                  block
                  :disabled="selectMonster.length === 0"
                  prepend-icon="mdi-magnify"
                  class="search-btn"
                >
                  검색
                </v-btn>
                <v-btn 
                  v-if="selectMonster.length > 0"
                  @click="clearMonsters"
                  size="small"
                  variant="outlined"
                  color="error"
                  prepend-icon="mdi-delete-outline"
                  block
                >
                  전체 삭제
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- 카드 그리드 레이아웃 -->
      <div :class="{ 'mb-mobile-search': mobile }">
        <!-- 데이터가 없을 때 -->
        <v-card v-if="monsterList.length === 0" class="empty-state-card" elevation="2">
          <v-card-text class="text-center pa-8 pa-md-12">
            <v-icon 
              :size="mobile ? 80 : 120" 
              color="grey-lighten-1"
              class="mb-4"
            >
              mdi-database-search-outline
            </v-icon>
            <h3 
              class="mb-3"
              :class="mobile ? 'text-h6' : 'text-h5'"
            >
              검색 결과가 없습니다
            </h3>
            <p 
              class="text-grey-darken-1 mb-0"
              :class="mobile ? 'text-body-2' : 'text-body-1'"
            >
              다른 조건으로 검색해보세요
            </p>
          </v-card-text>
        </v-card>

        <!-- 데이터가 있을 때 -->
        <template v-else>
          <v-row>
            <v-col
              v-for="item in paginatedMonsterList"
              :key="item.key"
              class="monster-col"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card
                class="monster-card"
                elevation="2"
                @click="goDetail(item)"
              >
                <!-- 몬스터 이미지 영역 -->
                <div class="monster-images-section">
                  <div class="d-flex align-center justify-center pa-4">
                    <!-- 첫 번째 몬스터 (리더) -->
                    <div class="position-relative me-n3">
                      <v-avatar 
                        v-if="item.image_url1"
                        :size="mobile ? 50 : 60"
                        class="border-3 border-white monster-avatar"
                      >
                        <v-img :src="`${Constants.BASE_URL}${item.image_url1}`" />
                      </v-avatar>
                      <!-- 리더 아이콘 -->
                      <v-avatar 
                        v-if="item.leader_icon"
                        :size="mobile ? 18 : 22"
                        class="position-absolute leader-icon"
                      >
                        <v-img 
                          :src="`${Constants.BASE_URL}${item.leader_icon}`"
                          :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                        />
                      </v-avatar>
                    </div>
                    <!-- 두 번째 몬스터 -->
                    <v-avatar 
                      v-if="item.image_url2"
                      :size="mobile ? 50 : 60"
                      class="border-3 border-white me-n3 monster-avatar"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url2}`" />
                    </v-avatar>
                    <!-- 세 번째 몬스터 -->
                    <v-avatar 
                      v-if="item.image_url3"
                      :size="mobile ? 50 : 60"
                      class="border-3 border-white monster-avatar"
                    >
                      <v-img :src="`${Constants.BASE_URL}${item.image_url3}`" />
                    </v-avatar>
                  </div>
                </div>

                <!-- 정보 영역 -->
                <v-card-text class="pa-3">
                  <!-- 승률 -->
                  <div class="text-center mb-2">
                    <v-chip 
                      :color="item.total_rate >= 50 ? 'success' : item.total_rate >= 30 ? 'warning' : 'error'"
                      size="small"
                      variant="flat"
                      class="font-weight-bold"
                    >
                      승률 {{ item.total_rate }}%
                    </v-chip>
                  </div>

                  <!-- 승리/패배 -->
                  <div class="d-flex justify-space-around text-caption">
                    <div class="text-center">
                      <div class="text-grey-darken-1 mb-1">승리</div>
                      <div class="text-success font-weight-bold">{{ item.win_count }}</div>
                    </div>
                    <v-divider vertical />
                    <div class="text-center">
                      <div class="text-grey-darken-1 mb-1">패배</div>
                      <div class="text-error font-weight-bold">{{ item.lose_count }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- 페이지네이션 -->
          <div class="d-flex justify-center py-4 py-md-6">
            <v-pagination
              v-model="page"
              :length="Math.ceil(totalItems / itemsPerPage)"
              :total-visible="mobile ? 5 : 7"
              :size="mobile ? 'small' : 'default'"
            />
          </div>
        </template>
      </div>
    </v-container>

    <!-- 모바일 하단 고정 몬스터 선택 바 -->
    <div v-if="mobile" class="mobile-search-bar" @click="isSearchOpen = true">
      <div v-if="selectMonster.length === 0" class="d-flex align-center justify-space-between pa-3">
        <div class="d-flex align-center">
          <v-icon class="me-2" color="primary">mdi-magnify</v-icon>
          <span class="font-weight-medium text-grey-darken-1">몬스터 검색</span>
        </div>
        <v-icon color="grey">mdi-chevron-up</v-icon>
      </div>

      <!-- 선택된 몬스터가 있을 때 -->
      <div v-else class="selected-bar-content">
        <div class="d-flex align-center justify-space-between pa-3">
          <div class="d-flex align-center flex-grow-1">
            <!-- 몬스터 아바타 미리보기 -->
            <div class="d-flex align-center me-3">
              <v-avatar 
                v-for="(monsterId, index) in selectMonster" 
                :key="monsterId"
                :size="48"
                :class="index > 0 ? 'ms-n3' : ''"
                class="monster-avatar"
              >
                <v-img :src="getMonsterImage(monsterId)" />
              </v-avatar>
            </div>
            <!-- 선택 정보 -->
            <div class="d-flex flex-column">
              <span class="selected-label">선택된 몬스터</span>
              <div class="d-flex align-center">
                <span class="selected-count">{{ selectMonster.length }}</span>
                <span class="selected-total">/ 3</span>
              </div>
            </div>
          </div>
          <v-chip 
            color="primary" 
            variant="flat"
            class="px-3 search-chip"
          >
            <v-icon start size="small">mdi-magnify</v-icon>
            검색
          </v-chip>
        </div>
      </div>
    </div>

    <!-- 모바일 검색 패널 (Bottom Sheet) -->
    <v-bottom-sheet v-model="isSearchOpen" :max-height="'90vh'">
      <v-card>
        <v-card-title class="bg-primary text-white d-flex align-center justify-space-between pa-3">
          <div class="d-flex align-center">
            <v-icon class="me-2">mdi-magnify</v-icon>
            <span>몬스터 검색</span>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn 
              v-if="selectMonster.length > 0"
              @click="clearMonsters"
              size="small"
              variant="text"
              color="white"
              class="text-caption"
            >
              전체삭제
            </v-btn>
            <v-btn 
              icon="mdi-close"
              size="small"
              variant="text"
              color="white"
              @click="isSearchOpen = false"
            />
          </div>
        </v-card-title>

        <v-card-text class="pa-4">
          <MonsterSearch 
            v-model="selectMonster"
            :monster-name-list="monsterNameList"
            @search="handleSearchMobile"
            ref="monsterSearchMobileRef"
          />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>
<script setup>
import MonsterSearch from '~/components/common/monster-search.vue';
import { useSearchStateStore } from '~/stores/search-state';
// 모바일 여부 확인
const mobile = ref(false);
const checkMobile = () => {
  mobile.value = window.innerWidth < 960;
};
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const route = useRoute();
const searchStateStore = useSearchStateStore();

const schData = ref({});
const selectMonster = ref([]);
const lastSearchedMonsters = ref([]); // 마지막 검색 상태 저장
const monsterList = ref([]);
const monsterNameList = ref([]);
const searchText = ref("");
const matchId = ref(null);
const monsterSearchRef = ref();
const monsterSearchMobileRef = ref();
const guildList = ref([]);
const availableGuilds = ref([]);
const selectedGuilds = ref([]);
const selectedGuildIds = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const isSearchOpen = ref(false);
const totalItems = computed(() => monsterList.value.length);
const paginatedMonsterList = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return monsterList.value.slice(start, end);
});

onMounted(async () => {
  // URL에서 siege 파라미터 추출
  const siegeParam = route.params.siege;
  console.log('받은 siege 파라미터:', siegeParam);
  
  // siege 파라미터가 숫자인 경우 match_id로 처리
  if (!isNaN(siegeParam)) {
    matchId.value = siegeParam;
    searchStateStore.setMatchId(parseInt(siegeParam));
  }
  
  // store에서 검색 상태 복원 (v-model로 자동 동기화)
  if (searchStateStore.selectedMonsters.length > 0) {
    selectMonster.value = [...searchStateStore.selectedMonsters];
    lastSearchedMonsters.value = [...searchStateStore.selectedMonsters]; // 초기 검색 상태 저장
  }
  
  await getMonsterList();
  await getGuildList();
  await search();
});

const getMonsterList = async () => {
  try {
    const searchData = $gfn_searchDataExtraction(schData.value);
    const res = await $api.post("/summonerswar/monster-list", searchData);
    monsterNameList.value = Array.isArray(res) ? [...res] : [];
  } catch (error) {
    console.error("몬스터 목록 조회 실패:", error);
    monsterNameList.value = [];
    $toast("몬스터 목록을 불러오는데 실패했습니다.", "error");
  }
};

const getGuildList = async () => {
  if (!matchId.value) return;
  
  try {
    // sessionStorage에서 길드 정보 가져오기
    const guildsData = sessionStorage.getItem(`siege_guilds_${matchId.value}`);
    if (guildsData) {
      const guilds = JSON.parse(guildsData);
      console.log('sessionStorage에서 받은 길드 목록:', guilds);
      
      if (guilds && Array.isArray(guilds)) {
        guildList.value = [...guilds];
        // EVE.RE를 제외한 길드들만 선택 가능하도록 필터링 (대소문자 무시)
        availableGuilds.value = guilds.filter(guild => 
          guild.guild_name && 
          guild.guild_name.toUpperCase() !== 'EVE.RE'
        );
        console.log('선택 가능한 길드 목록:', availableGuilds.value);
      }
    }
    // sessionStorage에 데이터가 없으면 길드 선택 UI를 표시하지 않음
  } catch (error) {
    console.error('길드 목록 조회 실패:', error);
    guildList.value = [];
    availableGuilds.value = [];
  }
};

const search = async () => {
  try {
    schData.value.monster_id1 = selectMonster.value[0];
    schData.value.monster_id2 = selectMonster.value[1];
    schData.value.monster_id3 = selectMonster.value[2];

    schData.value.match_id = matchId.value;
    schData.value.guild_ids =
      selectedGuildIds.value.length > 0 ? selectedGuildIds.value : [];
    const searchData = $gfn_searchDataExtraction(schData.value);
    const res = await $api.post("/summonerswar/enemyTeam-list", searchData);
    monsterList.value = Array.isArray(res) ? [...res] : [];
    // 검색 시 페이지를 1로 리셋
    page.value = 1;
  } catch (error) {
    console.error("적 팀 목록 조회 실패:", error);
    monsterList.value = [];
    $toast("적 팀 목록을 불러오는데 실패했습니다.", "error");
  }
};

const handleSearch = () => {
  // v-model로 이미 동기화되어 있으므로 store에만 저장하고 검색
  lastSearchedMonsters.value = [...selectMonster.value]; // 검색 상태 저장
  searchStateStore.setSelectedMonsters(selectMonster.value);
  search();
};

const toggleGuildSelection = (guildName) => {
  const index = selectedGuilds.value.indexOf(guildName);
  if (index > -1) {
    selectedGuilds.value.splice(index, 1);
  } else {
    selectedGuilds.value.push(guildName);
  }
  onGuildSelectionChange();
};

const onGuildSelectionChange = () => {
  // 선택된 길드 이름에서 길드 ID 추출 (문자열로 변환)
  selectedGuildIds.value = selectedGuilds.value.map(guildName => {
    const guild = availableGuilds.value.find(g => g.guild_name === guildName);
    return guild ? String(guild.guild_id) : null;
  }).filter(id => id !== null);
  
  console.log('선택된 길드들:', selectedGuilds.value);
  console.log('선택된 길드 ID들:', selectedGuildIds.value);
  // 길드 선택 변경 시 검색 실행
  search();
};

const goDetail = (monster) => {
  // match_id가 있으면 monster-key_match-id 형태로 전달
  if (matchId.value) {
    navigateTo({
      path: `/detail/${monster.key}_${matchId.value}`,
    });
  } else {
    // match_id가 없으면 일반 형태로 전달
    navigateTo({
      path: "/detail/" + monster.key,
    });
  }
};

const add = () => {
  addpopup.value.open("bang");
};

const clearMonsters = () => {
  selectMonster.value = [];
  lastSearchedMonsters.value = []; // 검색 상태도 초기화
  searchStateStore.setSelectedMonsters([]);
  search(); // 빈 검색 실행
};

const handleSearchMobile = () => {
  handleSearch();
  isSearchOpen.value = false;
};

const getMonsterImage = (monsterId) => {
  const monster = monsterNameList.value.find(m => m.monster_id === monsterId);
  return monster ? `${Constants.BASE_URL}${monster.image_url}` : '';
};

// 모바일 검색 패널이 닫힐 때 처리
watch(isSearchOpen, (newValue, oldValue) => {
  // 열릴 때는 아무것도 하지 않음
  if (newValue) return;
  
  // 닫힐 때
  if (oldValue && !newValue) {
    // 선택이 변경되었으면 자동으로 검색
    const isChanged = JSON.stringify(selectMonster.value) !== JSON.stringify(lastSearchedMonsters.value);
    if (isChanged) {
      handleSearch();
    }
  }
});
</script>
<style scoped>
/* 페이지 레이아웃 */
.page-container {
  background: #fafafa;
}

.title-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
}

.section-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: white;
}

.section-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.85) 100%);
  color: white !important;
  font-weight: 600;
}

/* 길드 선택 */
.guild-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

@media (min-width: 960px) {
  .guild-item {
    padding: 14px 18px;
  }
}

.guild-item:hover {
  background: #f5f7fa;
}

.guild-item-selected {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.guild-name {
  color: #1a1a1a;
  margin-bottom: 2px;
}

.guild-rating {
  font-size: 0.875rem;
}

/* 몬스터 카드 */
.monster-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px !important;
  overflow: hidden;
  height: 100%;
  background: white;
  border: 1px solid #e0e0e0;
}

/* PC(대형 화면)에서 5열 배치 */
@media (min-width: 1280px) {
  .monster-col {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

.monster-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
  border-color: rgb(var(--v-theme-primary));
}

.monster-images-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 2px solid #f0f0f0;
  position: relative;
}

.monster-avatar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  border: 3px solid white !important;
}

.leader-icon {
  bottom: -4px;
  left: -4px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  border: 2px solid white;
}

/* 모바일 검색 바 */
.mobile-search-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.15), 0 -2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  border-top: 2px solid #e0e0e0;
}

.mobile-search-bar:active {
  background: #f8f9fa;
}

.selected-bar-content {
  background: linear-gradient(to right, #f8f9fa 0%, #ffffff 100%);
}

.mb-mobile-search {
  padding-bottom: 50px !important;
}

.search-chip {
  display: inline-flex !important;
  align-items: center !important;
  font-weight: 600;
}

.search-chip .v-icon {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.selected-label {
  font-size: 13px;
  color: #616161;
  line-height: 1.2;
  font-weight: 500;
}

.selected-count {
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
}

.selected-total {
  font-size: 15px;
  font-weight: 400;
  color: #9e9e9e;
  margin-left: 4px;
  line-height: 1;
}

/* Empty State */
.empty-state-card {
  border-radius: 16px !important;
  background: white;
  border: 2px dashed #e0e0e0;
}

/* 반응형 개선 */
@media (max-width: 600px) {
  .title-section {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }
  
  .guild-item {
    padding: 10px 12px;
  }
  
  .section-card {
    border-radius: 12px !important;
  }
  
  .monster-card {
    border-radius: 12px !important;
  }
}

@media (min-width: 960px) {
  .content-section {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .title-section {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .search-btn {
    height: 36px !important;
    font-size: 0.875rem !important;
  }
}
</style>
