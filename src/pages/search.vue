<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-icon @click="dialog = false" style="margin-right: 16px"
          >mdi-arrow-left</v-icon
        >
        <v-autocomplete
          v-model="selectMonster"
          :items="monsterNameList"
          chips
          multiple
          item-text="kr_name"
          item-value="monster_id"
          close-text
          hide-details
          :search-input.sync="searchText"
        >
          <template #selection="{ item, attrs, selected, select }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item.monster_id)"
            >
              <v-img
                :width="16"
                aspect-ratio="16/9"
                cover
                :src="require(`~/assets${item.image_url}`)"
                style="float: left; height: 16px"
              ></v-img>
              <span>
                {{ item.kr_name }}
              </span>
            </v-chip>
          </template>
          <template #item="{ item, on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-title>
                <v-img
                  :width="30"
                  aspect-ratio="16/9"
                  cover
                  :src="require(`~/assets${item.image_url}`)"
                  style="float: left; height: 30px"
                ></v-img>
                <p>{{ item.kr_name }}<br />{{ item.un_name }}</p>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-toolbar>

      <v-list lines="two" id="occupation">
        <div class="contentBox">
          <v-list-subheader>선택 몬스터</v-list-subheader>
          <v-list-item>
            <div :class="selectedMonsterList.length > 0 ? '' : 'leader'">
              <img
                v-if="selectedMonsterList[0]"
                :src="require(`@/assets${selectedMonsterList[0].image_url}`)"
                @click="monsterSelected(selectedMonsterList[0])"
              />
              <img
                v-if="!selectedMonsterList[0]"
                :src="require(`@/assets/images/unit_select_icon.png`)"
              />
            </div>
            <div>
              <img
                v-if="selectedMonsterList[1]"
                :src="require(`@/assets${selectedMonsterList[1].image_url}`)"
                @click="monsterSelected(selectedMonsterList[1])"
              />
              <img
                v-if="!selectedMonsterList[1]"
                :src="require(`@/assets/images/unit_select_icon.png`)"
              />
            </div>
            <div>
              <img
                v-if="selectedMonsterList[2]"
                :src="require(`@/assets${selectedMonsterList[2].image_url}`)"
                @click="monsterSelected(selectedMonsterList[2])"
              />
              <img
                v-if="!selectedMonsterList[2]"
                :src="require(`@/assets/images/unit_select_icon.png`)"
              />
            </div>
          </v-list-item>
          <div class="btnBox">
            <v-btn @click="reset()" style="height: 54px">초기화</v-btn>
            <v-btn @click="search()" style="height: 54px">검색</v-btn>
          </div>
        </div>

        <v-divider></v-divider>
        <div class="contentBox">
          <v-list-subheader>최근 검색</v-list-subheader>

          <v-list-item
            subtitle="Notify me about updates to apps or games that I downloaded"
            title="Notifications"
            @click="notifications = !notifications"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="notifications"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dialog: false,
      selectMonster: [],
      selectedMonsterList: [],
      monsterNameList: [],
      searchText: "",
    };
  },
  computed: {
    getMonster() {
      return this.$store.getters["monster/getMonster"];
    },
  },
  mounted() {},
  methods: {
    open() {
      this.dialog = true;
    },
  },
};
</script>
<style>
#occupation .v-list-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  position: relative;
  -webkit-text-decoration: none;
  text-decoration: none;
  max-width: 350px;
  margin: 0 auto;
}

#occupation .v-list-item > div {
  width: 30%;
  height: 100px;
  position: relative;
  background: #574424;
  border: 4px solid #6d5424;
  border-radius: 10px;
}

#occupation .v-list-item > div > img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#occupation .v-list-item .leader:after {
  content: "Leader";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: -1px 0 #2c1f11, 0 1px #2c1f11, 1px 0 #2c1f11, 0 -1px #2c1f11;
}

.contentBox {
  box-sizing: border-box;
  padding: 10px;
}
</style>
