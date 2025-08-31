<template>
  <div class="page-container">
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
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
  await search();
});

const getMonsterList = async () => {
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/monster-list", searchData);
  monsterNameList.value = [...res];
};

const search = async (isFirst = false) => {
  if (isFirst) {
    schData.value.offset = 1;
  }
  schData.value.monster_id1 = selectMonster.value[0];
  schData.value.monster_id2 = selectMonster.value[1];
  schData.value.monster_id3 = selectMonster.value[2];
  
  schData.value.match_id = matchId.value;
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/enemyTeam-list", searchData);
  const totalPageRes = await $api.get("/summonerswar/total-page-count", searchData);
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
</style>
