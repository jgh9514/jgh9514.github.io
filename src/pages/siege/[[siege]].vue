<template>
  <div>
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    <v-container>
      <v-row style="align-items: center">
        <v-col cols="9">
          <v-card color="blue-grey-darken-1" class="mx-auto" max-width="420">
            <v-autocomplete
              v-model="selectMonster"
              :items="monsterNameList"
              color="blue-grey-lighten-2"
              item-title="kr_name"
              item-value="monster_id"
              chips
              closable-chips
              multiple
              hide-details
              clear-on-select
              placeholder="몬스터 선택"
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
        </v-col>
        <v-col cols="3">
          <v-btn @click="search(true)" style="height: 54px; width: 100%">검색</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-btn v-if="false" @click="add()">추가</v-btn>
      <v-data-table
        :headers="[
          {
            title: '방덱 리스트',
            key: 'monsters',
            align: 'start',
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
              <span class="monster-images">
                <img
                  v-if="item.image_url1"
                  :src="`${Constants.BASE_URL}${item.image_url1}`"
                />
                <img
                  v-if="item.image_url2"
                  :src="`${Constants.BASE_URL}${item.image_url2}`"
                />
                <img
                  v-if="item.image_url3"
                  :src="`${Constants.BASE_URL}${item.image_url3}`"
                />
              </span>
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
const schData = ref({ paging: 5, offset: 1 });
const selectMonster = ref([]);
const monsterList = ref([]);
const monsterNameList = ref([]);
const searchText = ref("");
const totalPage = ref(0);

const listData = [
  { cd: 5, cd_nm: "5개씩 보기" },
  { cd: 10, cd_nm: "10개씩 보기" },
  { cd: 15, cd_nm: "15개씩 보기" },
];

onMounted(async () => {
  await getMonsterList();
  await search();
});

watchEffect(() => {
  if (selectMonster.value.length > 3) {
    $toast("최대 3개까지 선택할 수 있습니다.", "error");
    selectMonster.value = selectMonster.value.slice(0, 3);
  }
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
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/enemyTeam-list", searchData);
  monsterList.value = [...res];

  totalPage.value = await $api.get("/summonerswar/total-page-count", searchData);
};

const goDetail = (monster) => {
  navigateTo({
    path: "/detail/" + monster.key,
  });
};

const add = () => {
  addpopup.value.open("bang");
};

const remove = (monster_id) => {
  selectMonster.value = selectMonster.value.filter((e) => e !== monster_id);
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
    search();
  }
};

const nextPage = () => {
  if (schData.value.offset <= Math.floor(totalPage.value / schData.value.paging)) {
    schData.value.offset++;
    search();
  }
};

const changePage = (page) => {
  schData.value.offset = page;
  search();
};

const viewCountChange = () => {
  schData.value.offset = 1;
  search();
};
</script>
<style>
.v-list-item--active {
  background: #f00 !important;
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
</style>
