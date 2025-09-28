<template>
  <div class="page-container">
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    <!-- 길드 선택 섹션 -->
    <div v-if="availableGuilds.length > 0" class="guild-selector mb-4">
      <v-card class="guild-selection-card">
        <v-card-title class="guild-selection-title">
          <v-icon class="me-2" color="primary">mdi-account-group</v-icon>
          상대 길드 선택
        </v-card-title>
        <v-card-text class="pa-0">
          <div class="guild-checkboxes">
            <div 
              v-for="guild in availableGuilds" 
              :key="guild.guild_name"
              class="guild-checkbox-item"
            >
              <v-checkbox
                v-model="selectedGuilds"
                :value="guild.guild_name"
                color="primary"
                hide-details
                class="guild-checkbox"
                @change="onGuildSelectionChange"
              />
              <div class="guild-info">
                <div class="guild-name">{{ guild.guild_name }}</div>
                <div class="guild-rating">
                  <span>{{ guild.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <MonsterSearch 
      :monster-name-list="monsterNameList"
      @search="handleSearch"
      @monster-change="handleMonsterChange"
      ref="monsterSearchRef"
    />
    <v-container>
      <v-btn v-if="false" @click="add()">추가</v-btn>
      <v-data-table
        :headers="[
          {
            title: '방덱 리스트',
            key: 'monsters',
            align: 'center',
            width: '50%',
            sortable: false,
          },
          {
            title: '승률',
            key: 'total_rate',
            align: 'center',
            width: '16%',
            sortable: false,
          },
          {
            title: '승리',
            key: 'win_count',
            align: 'center',
            width: '16%',
            sortable: false,
          },
          {
            title: '패배',
            key: 'lose_count',
            align: 'center',
            width: '16%',
            sortable: false,
          },
        ]"
        :items="monsterList"
        :items-per-page="schData.paging"
        class="monsterList"
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td @click="goDetail(item)" style="cursor: pointer">
              <div class="monster-images">
                <div class="monster-container">
                  <img
                    v-if="item.image_url1"
                    :src="`${Constants.BASE_URL}${item.image_url1}`"
                    class="monster-img-first"
                  />
                  <!-- 리더 아이콘을 첫 번째 몬스터 위에 겹치게 표시 -->
                  <div v-if="item.leader_icon" class="leader-badge">
                    <img 
                      :src="`${Constants.BASE_URL}${item.leader_icon}`" 
                      class="leader-icon-small"
                      :title="`${item.leader_type} ${item.leader_stat} +${item.leader_increase_by}%`"
                    />
                  </div>
                </div>
                <div class="monster-container">
                <img
                  v-if="item.image_url2"
                  :src="`${Constants.BASE_URL}${item.image_url2}`"
                  class="monster-img"
                />
                </div>
                <div class="monster-container">
                <img
                  v-if="item.image_url3"
                  :src="`${Constants.BASE_URL}${item.image_url3}`"
                  class="monster-img"
                />
                </div>
              </div>
            </td>
            <td>
              {{ item.total_rate + "%" }}
            </td>
            <td>
              {{ item.win_count }}
            </td>
            <td>
              {{ item.lose_count }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
    <div class="text-center">
      <div class="pagination">
        <button class="page-btn" @click="prevPage" :disabled="schData.offset === 1">
          <v-icon>mdi-menu-left</v-icon>
        </button>
        <button
          v-for="pageNum in displayPages"
          :key="pageNum"
          class="page-btn"
          :class="{ active: pageNum === schData.offset }"
          @click="changePage(pageNum)"
        >
          {{ pageNum }}
        </button>
        <button
          class="page-btn"
          @click="nextPage"
          :disabled="schData.offset > Math.floor(totalPage / schData.paging)"
        >
          <v-icon>mdi-menu-right</v-icon>
        </button>
      </div>
      <v-select
        v-model="schData.paging"
        :items="listData"
        item-title="cd_nm"
        item-value="cd"
        variant="outlined"
        style="padding: 0 20px; width: 200px; float: right"
        @update:model-value="viewCountChange"
      ></v-select>
    </div>
  </div>
</template>
<script setup>
import MonsterSearch from '~/components/common/monster-search.vue';
import { useSearchStateStore } from '~/stores/search-state';

const route = useRoute();
const searchStateStore = useSearchStateStore();

const schData = ref({ paging: 5, offset: 1 });
const selectMonster = ref([]);
const monsterList = ref([]);
const monsterNameList = ref([]);
const searchText = ref("");
const totalPage = ref(0);
const matchId = ref(null);
const monsterSearchRef = ref();
const guildList = ref([]);
const availableGuilds = ref([]);
const selectedGuilds = ref([]);
const selectedGuildIds = ref([]);

const listData = [
  { cd: 5, cd_nm: "5개씩 보기" },
  { cd: 10, cd_nm: "10개씩 보기" },
  { cd: 15, cd_nm: "15개씩 보기" },
];

onMounted(async () => {
  // URL에서 siege 파라미터 추출
  const siegeParam = route.params.siege;
  console.log('받은 siege 파라미터:', siegeParam);
  
  // siege 파라미터가 숫자인 경우 match_id로 처리
  if (!isNaN(siegeParam)) {
    matchId.value = siegeParam;
    searchStateStore.setMatchId(parseInt(siegeParam));
  }
  
  // store에서 검색 상태 복원
  if (searchStateStore.selectedMonsters.length > 0) {
    selectMonster.value = [...searchStateStore.selectedMonsters];
    // MonsterSearch 컴포넌트에도 선택된 몬스터 설정
    if (monsterSearchRef.value) {
      monsterSearchRef.value.setSelectedMonsters(selectMonster.value);
    }
  }
  if (searchStateStore.currentPage > 1) {
    schData.value.offset = searchStateStore.currentPage;
  }
  if (searchStateStore.pageSize !== 5) {
    schData.value.paging = searchStateStore.pageSize;
  }
  
  await getMonsterList();
  await getGuildList();
  await search();
});

const getMonsterList = async () => {
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/monster-list", searchData);
  monsterNameList.value = [...res];
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

const search = async (isFirst = false) => {
  if (isFirst) {
    schData.value.offset = 1;
  }
  schData.value.monster_id1 = selectMonster.value[0];
  schData.value.monster_id2 = selectMonster.value[1];
  schData.value.monster_id3 = selectMonster.value[2];
  
  schData.value.match_id = matchId.value;
  schData.value.guild_ids = selectedGuildIds.value.length > 0 ? selectedGuildIds.value : [];
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.post("/summonerswar/enemyTeam-list", searchData);
  const totalPageRes = await $api.post("/summonerswar/total-page-count", searchData);
  monsterList.value = [...res];
  totalPage.value = totalPageRes;
};

const handleSearch = (selectedMonsters) => {
  selectMonster.value = selectedMonsters;
  // store에 검색 상태 저장
  searchStateStore.setSelectedMonsters(selectedMonsters);
  searchStateStore.setCurrentPage(1);
  search(true);
};

const handleMonsterChange = (selectedMonsters) => {
  selectMonster.value = selectedMonsters;
  // store에 선택된 몬스터 저장
  searchStateStore.setSelectedMonsters(selectedMonsters);
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
  search(true);
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



const displayPages = computed(() => {
  const pages = [];
  const totalPages = Math.ceil(totalPage.value / schData.value.paging);
  const currentPage = schData.value.offset;

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
  }
  return pages;
});

const prevPage = () => {
  if (schData.value.offset > 1) {
    schData.value.offset--;
    searchStateStore.setCurrentPage(schData.value.offset);
    search();
  }
};

const nextPage = () => {
  if (schData.value.offset <= Math.floor(totalPage.value / schData.value.paging)) {
    schData.value.offset++;
    searchStateStore.setCurrentPage(schData.value.offset);
    search();
  }
};

const changePage = (page) => {
  schData.value.offset = page;
  searchStateStore.setCurrentPage(page);
  search();
};

const viewCountChange = () => {
  schData.value.offset = 1;
  searchStateStore.setCurrentPage(1);
  searchStateStore.setPageSize(schData.value.paging);
  search();
};
</script>
<style>
/* 페이지 전체 컨테이너 */
.page-container {
  max-width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.page-btn {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  padding: 5px 10px;
  margin: 0 5px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn.active {
  background: #f00;
  color: #fff;
}

.monster-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  margin-left: -15px;
  object-fit: cover;
  z-index: 1;
}

.monster-img-first {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  margin-left: 0;
  object-fit: cover;
  z-index: 3;
}

/* 길드 선택 스타일 */
.guild-selector {
  margin: 16px;
}

.guild-selection-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.guild-selection-title {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 1.1rem;
}

.guild-checkboxes {
  display: flex;
  gap: 0;
  padding: 16px;
}

.guild-checkbox-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  width: 50%;
  flex: 1;
}

.guild-checkbox-item:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.guild-checkbox-item:first-child {
  border-radius: 8px 0 0 0;
}

.guild-checkbox-item:nth-child(2) {
  border-radius: 0 8px 0 0;
}

.guild-checkbox-item:nth-child(3) {
  border-radius: 0 0 0 8px;
}

.guild-checkbox-item:nth-child(4) {
  border-radius: 0 0 8px 0;
}

.guild-checkbox {
  margin-right: 12px;
  flex-shrink: 0;
}

.guild-info {
  flex: 1;
  min-width: 0;
}

.guild-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.guild-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #666;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .guild-checkboxes {
    gap: 8px;
    padding: 12px;
  }
  
  .guild-checkbox-item {
    width: 100%;
    border-radius: 8px !important;
    padding: 12px;
  }
  
  .guild-selection-title {
    padding: 12px 16px;
    font-size: 1rem;
  }
}
</style>
