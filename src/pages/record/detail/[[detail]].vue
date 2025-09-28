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
              <div class="battle-row">
                <div class="battle-side left-side">
                  <p
                    class="battle-result"
                    :class="item.win_lose === '1' ? 'win' : 'lose'"
                  >
                    {{ item.win_lose === "1" ? "WIN" : "LOSE" }}
                  </p>
                  <p class="guild-name">{{ item.guild_name }}</p>
                  <p class="player-name">{{ item.wizard_name }}</p>
                  <div class="monster-images">
                    <img 
                      v-if="item.attack_monster_1" 
                      :src="`${Constants.BASE_URL}${item.attack_monster_1}`" 
                      class="monster-img"
                    />
                    <img 
                      v-if="item.attack_monster_2" 
                      :src="`${Constants.BASE_URL}${item.attack_monster_2}`" 
                      class="monster-img"
                    />
                    <img 
                      v-if="item.attack_monster_3" 
                      :src="`${Constants.BASE_URL}${item.attack_monster_3}`" 
                      class="monster-img"
                    />
                  </div>
                </div>
                <div class="battle-vs">
                  <span>vs</span>
                </div>
                <div class="battle-side right-side">
                  <p
                    class="battle-result"
                    :class="item.win_lose === '1' ? 'lose' : 'win'"
                  >
                    {{ item.win_lose === "1" ? "LOSE" : "WIN" }}
                  </p>
                  <p class="guild-name">{{ item.opp_guild_name }}</p>
                  <p class="player-name">{{ item.opp_wizard_name }}</p>
                  <div class="monster-images">
                    <img 
                      v-if="item.defense_monster_1" 
                      :src="`${Constants.BASE_URL}${item.defense_monster_1}`" 
                      class="monster-img"
                    />
                    <img 
                      v-if="item.defense_monster_2" 
                      :src="`${Constants.BASE_URL}${item.defense_monster_2}`" 
                      class="monster-img"
                    />
                    <img 
                      v-if="item.defense_monster_3" 
                      :src="`${Constants.BASE_URL}${item.defense_monster_3}`" 
                      class="monster-img"
                    />
                  </div>
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
.battle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.battle-side {
  flex: 1;
  min-width: 0;
}

.battle-vs {
  flex-shrink: 0;
  margin: 0 10px;
}

.battle-row .left-side .guild-name {
  text-align: left;
}
.battle-row .left-side .player-name {
  text-align: left;
}
.battle-row .right-side .guild-name {
  text-align: right;
}
.battle-row .right-side .player-name {
  text-align: right;
}
.monster-images {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}
.monster-images > img {
  width: 33.3%;
  height: auto;
}
</style>
