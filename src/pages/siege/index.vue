<template>
  <div>
    <div>
      <img :src="require(`~/assets/images/banner.jpg`)" width="100%" />
    </div>
    <v-container>
      <v-row style="align-items: center">
        <v-col cols="9">
          <template>
            <v-card color="blue-grey-darken-1" class="mx-auto" max-width="420">
              <v-autocomplete v-model="selectMonster" :items="monsterNameList" chips multiple item-text="kr_name"
                item-value="monster_id" close-text hide-details :search-input.sync="searchText">
                <template #selection="{ item, attrs, selected, select }">
                  <v-chip v-bind="attrs" :input-value="selected" close @click="select"
                    @click:close="remove(item.monster_id)">
                    <v-img :width="16" aspect-ratio="16/9" cover :src="require(`~/assets${item.image_url}`)"
                      style="float: left; height: 16px"></v-img>
                    <span>
                      {{ item.kr_name }}
                    </span>
                  </v-chip>
                </template>
                <template #item="{ item, on, attrs }">
                  <v-list-item v-bind="attrs" v-on="on" @click="clearSearchText">
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-img :width="30" aspect-ratio="16/9" cover :src="require(`~/assets${item.image_url}`)"
                          style="float: left; height: 30px"></v-img>
                        <p>{{ item.kr_name }}<br />{{ item.un_name }}</p>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-card>
          </template>
        </v-col>
        <v-col cols="3">
          <v-btn @click="search()" style="height: 54px; width: 100%">검색</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-btn v-if="false" @click="add()">추가</v-btn>
      <v-row justify="center" id="monsterList">
        <v-col cols="12">
          <v-row class="header">
            <v-col cols="6"> 방덱 리스트 </v-col>
            <v-col cols="2"> 승률 </v-col>
            <v-col cols="2"> 승리 </v-col>
            <v-col cols="2"> 패배 </v-col>
          </v-row>
          <v-row v-for="monster in showMonsterList" :key="monster.key">
            <v-col cols="6" @click="goDetail(monster)">
              <img v-if="monster.image_url1 != undefined" :src="require(`~/assets${monster.image_url1}`)" />
              <img v-if="monster.image_url2 != undefined" :src="require(`~/assets${monster.image_url2}`)" />
              <img v-if="monster.image_url3 != undefined" :src="require(`~/assets${monster.image_url3}`)" />
            </v-col>
            <v-col cols="2">
              {{ monster.total_rate + "%" }}
            </v-col>
            <v-col cols="2">
              {{ monster.win_count }}
            </v-col>
            <v-col cols="2">
              {{ monster.lose_count }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center">
      <v-pagination v-model="page" :length="Math.floor(monsterList.length / schData.paging)" :total-visible="6"
        @input="pageChange('paging')"></v-pagination>
      <v-select v-model="schData.paging" :items="listData" item-text="cd_nm" item-value="cd" variant="outlined"
        style="padding: 0 20px; width: 200px; float: right" @change="pageChange('select')"></v-select>
    </div>
    <addpopup ref="addpopup" />
  </div>
</template>

<script>
import addpopup from "@pages/addpopup.vue";

export default {
  components: {
    addpopup,
  },
  data() {
    return {
      schData: {
        paging: "5",
      },
      selectMonster: [],
      monsterList: [],
      showMonsterList: [],
      monsterNameList: [],
      searchText: "",
      page: 1,
      listData: [
        { cd: "5", cd_nm: "5개씩 보기" },
        { cd: "10", cd_nm: "10개씩 보기" },
        { cd: "15", cd_nm: "15개씩 보기" },
      ],
    };
  },
  computed: {
    wkplIcon() {
      if (this.likesAllwkpl) return "mdi-close-box";
      if (this.likesSomewkpl) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  watch: {
    selectMonster(newVal) {
      if (newVal.length > 3) {
        this.$toast.error("최대 3개까지 선택할 수 있습니다.");
        this.selectMonster = newVal.slice(0, 3);
      }
    },
  },
  async mounted() {
    await this.getMonsterList();
    await this.search();
  },
  methods: {
    clearSearchText() {
      this.$nextTick(() => {
        this.searchText = "";
      });
    },
    getMonsterList() {
      this.$axios
        .get("/api/v1/summonerswar/monster-list", { params: this.schData })
        .then((res) => {
          this.monsterNameList = res.data;
        });
    },
    async search() {
      this.schData.monster_id1 = this.selectMonster[0];
      this.schData.monster_id2 = this.selectMonster[1];
      this.schData.monster_id3 = this.selectMonster[2];
      await this.$axios
        .get("/api/v1/summonerswar/enemyTeam-list", { params: this.schData })
        .then((res) => {
          this.monsterList = res.data;
          console.log(this.monsterList)
        });
      this.pageChange();
    },
    goDetail(monster) {
      this.$router.push({
        name: "detail-detail",
        params: {
          detail: monster.key,
          dm1: monster.dm1,
          dm2: monster.dm2,
          dm3: monster.dm3,
        },
      });
    },
    add() {
      this.$refs.addpopup.open("bang");
    },
    json() {
      this.$router.push({
        name: "json-json",
      });
    },
    pageChange(val) {
      if (val === "select") this.page = 1;
      const pageNumber = this.page * this.schData.paging;
      const start =
        pageNumber - this.schData.paging > 0
          ? pageNumber - this.schData.paging
          : 0;
      const end =
        pageNumber - 1 < this.monsterList.length
          ? pageNumber - 1
          : this.monsterList.length;
      this.showMonsterList = this.monsterList.filter((e, index) => {
        if (start <= index && index <= end) {
          return e;
        }
      });
    },
    remove(monster_id) {
      this.selectMonster = this.selectMonster.filter((e) => {
        return e !== monster_id;
      });
    },
  },
};
</script>
<style scoped>
#monsterList .header {
  height: 50px;
}

#monsterList .col-12 .row {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 5px auto;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background-color: #27282e;
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
  padding: 10px 0;
}

#monsterList .row .col {
  padding: 3px;
  text-align: center;
  float: left;
}

#monsterList img:first-child {
  margin-left: 0 !important;
}

#monsterList img {
  float: left;
  margin-left: -10px;
  width: 33.3%;
  border: 2px solid #fff;
  border-radius: 50%;
  box-sizing: border-box;
}
</style>
<style>
.v-list-item--active {
  background: #f00 !important;
}
</style>