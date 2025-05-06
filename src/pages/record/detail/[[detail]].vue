<template>
  <div>
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    <v-container class="monsterList">
      <v-data-table
        :headers="[
          {
            title: '공격 로그',
            key: 'defense_monsters',
            align: 'start',
            width: '50%',
            sortable: false,
          },
        ]"
        :items="userList"
        items-per-page="999"
        class="userList"
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <div class="d-flex align-center">
                <div class="text-left" style="flex: 1">
                  <p
                    class="battle-result"
                    :class="item.win_lose === '1' ? 'win' : 'lose'"
                  >
                    {{ item.win_lose === "1" ? "WIN" : "LOSE" }}
                  </p>
                  <p class="guild-name">{{ item.guild_name }}</p>
                  <p class="player-name">{{ item.wizard_name }}</p>
                  <span class="monster-images">
                    <img :src="`${Constants.BASE_URL}${item.attack_monster_1}`" />
                    <img :src="`${Constants.BASE_URL}${item.attack_monster_2}`" />
                    <img :src="`${Constants.BASE_URL}${item.attack_monster_3}`" />
                  </span>
                </div>
                <span>vs</span>
                <div class="text-right" style="flex: 1">
                  <p
                    class="battle-result"
                    :class="item.win_lose === '1' ? 'lose' : 'win'"
                  >
                    {{ item.win_lose === "1" ? "LOSE" : "WIN" }}
                  </p>
                  <p class="guild-name">{{ item.opp_guild_name }}</p>
                  <p class="player-name">{{ item.opp_wizard_name }}</p>
                  <span class="monster-images">
                    <img :src="`${Constants.BASE_URL}${item.defense_monster_1}`" />
                    <img :src="`${Constants.BASE_URL}${item.defense_monster_2}`" />
                    <img :src="`${Constants.BASE_URL}${item.defense_monster_3}`" />
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>
<script setup>
const urlParams = $gfn_getUrlParams();

const schData = ref({ paging: 5, offset: 1 });
const userList = ref([]);

onMounted(async () => {
  schData.value.wizard_id = urlParams.detail;
  await search();
});

const search = async () => {
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/record-detail", searchData);
  userList.value = [...res];
  console.log(userList.value);
};

const goDetail = (user) => {
  navigateTo({
    path: "/record/detail/" + user.wizard_id,
  });
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
