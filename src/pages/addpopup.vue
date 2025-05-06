<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="orange">
          <v-btn @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>점령전 {{ type == 1 ? "방덱" : "공덱" }} 추가</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" @click="save"> 저장 </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list lines="two" id="occupation">
          <v-list-item>
            <div :class="selectedMonsterList.length > 0 ? '' : 'leader'">
              <img
                v-if="selectedMonsterList[0]"
                :src="`${Constants.BASE_URL}${selectedMonsterList[0].image_url}`"
                @click="monsterSelected(selectedMonsterList[0])"
              />
              <img
                v-if="!selectedMonsterList[0]"
                :src="`/_nuxt/assets/images/unit_select_icon.png`"
              />
            </div>
            <div>
              <img
                v-if="selectedMonsterList[1]"
                :src="`${Constants.BASE_URL}${selectedMonsterList[1].image_url}`"
                @click="monsterSelected(selectedMonsterList[1])"
              />
              <img
                v-if="!selectedMonsterList[1]"
                :src="`${Constants.BASE_URL}/images/unit_select_icon.png`"
              />
            </div>
            <div>
              <img
                v-if="selectedMonsterList[2]"
                :src="`${Constants.BASE_URL}${selectedMonsterList[2].image_url}`"
                @click="monsterSelected(selectedMonsterList[2])"
              />
              <img
                v-if="!selectedMonsterList[2]"
                :src="`${Constants.BASE_URL}/images/unit_select_icon.png`"
              />
            </div>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-tabs id="elemental" bg-color="deep-purple-darken-4" center-active>
          <v-tab @click="tabChange('Fire_a')"
            ><img :src="`${Constants.BASE_URL}/images/Fire_Icon.png`"
          /></v-tab>
          <v-tab @click="tabChange('Water_a')"
            ><img :src="`${Constants.BASE_URL}/images/Water_Icon.png`"
          /></v-tab>
          <v-tab @click="tabChange('Wind_a')"
            ><img :src="`${Constants.BASE_URL}/images/Wind_Icon.png`"
          /></v-tab>
          <v-tab @click="tabChange('Light_a')"
            ><img :src="`${Constants.BASE_URL}/images/Light_Icon.png`"
          /></v-tab>
          <v-tab @click="tabChange('Dark_a')"
            ><img :src="`${Constants.BASE_URL}/images/Dark_Icon.png`"
          /></v-tab>
        </v-tabs>
        <v-list lines="two" id="addMonsterList">
          <v-list-item>
            <div
              v-for="monster in monsterListFilter"
              :key="monster.id"
              :class="monster.active ? 'active' : ''"
              @click="monsterSelected(monster)"
            >
              <img :src="`${Constants.BASE_URL}${monster.image_url}`" />
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
const type = ref(0);
const defense_monster = ref("");
const dialog = ref(false);
const monsterList = ref([]);
const monsterListFilter = ref([]);
const selectedMonsterList = ref([]);

const emit = defineEmits(["close"]);
const open = async (openType, id) => {
  if (openType === "bang") {
    type.value = 1;
  } else if (openType === "empty") {
    type.value = 2;
    defense_monster.value = id;
    console.log(defense_monster.value);
  }
  dialog.value = true;
  await search();
};

const search = async () => {
  const res = await $api.get("/summonerswar/monster-list");
  monsterList.value = res;
  tabChange("Fire_a");
};

const tabChange = (val) => {
  monsterListFilter.value = monsterList.value.filter((e) => e.monster_elemental === val);
};

const monsterSelected = (monster) => {
  if (monster.active) {
    selectedMonsterList.value = selectedMonsterList.value.filter(
      (e) => e.monster_id !== monster.monster_id
    );
  } else {
    if (selectedMonsterList.value.length > 2) return;
    selectedMonsterList.value.push(monster);
  }
  monster.active = !monster.active;
};

const save = async () => {
  if (selectedMonsterList.value.length !== 3) {
    $toast($t("몬스터를 선택해주세요."), "error");
    return;
  }

  const saveData = {
    type: type.value,
    def_monster_1: defense_monster.value.dm1,
    def_monster_2: defense_monster.value.dm2,
    def_monster_3: defense_monster.value.dm3,
    atk_monster_1: selectedMonsterList.value[0].monster_id,
    atk_monster_2: selectedMonsterList.value[1].monster_id,
    atk_monster_3: selectedMonsterList.value[2].monster_id,
  };

  const res = await $api.post("/summonerswar/enemyTeam-save", saveData);
  $toast($t("저장되었습니다."));
  close();
};

const close = () => {
  selectedMonsterList.value = [];
  dialog.value = false;
  emit("close");
};

defineExpose({
  open,
});
</script>

<style>
#addpopup {
  background: #fff;
}
.v-slide-group__prev--disabled {
  display: none !important;
}
#elemental .v-tab {
  width: 20%;
  min-width: inherit;
  max-width: inherit;
}
.v-dialog__container {
  display: inherit;
}
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
#occupation .v-list-item > .v-list-item__content {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex: 1 1 100%;
  width: 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  position: relative;
  -webkit-text-decoration: none;
  text-decoration: none;
  max-width: 350px;
  margin: 0 auto;
}
#occupation .v-list-item .v-list-item__content > div {
  width: 30%;
  height: 100px;
  position: relative;
  background: #574424;
  border: 4px solid #6d5424;
  border-radius: 10px;
}

#occupation .v-list-item .v-list-item__content > div > img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80px;
}
#occupation .v-list-item .v-list-item__content .leader:after {
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
#addMonsterList {
  height: 500px;
  overflow-y: scroll;
}
#addMonsterList .v-list-item .v-list-item__content {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 0;
  gap: 5px;
}
#addMonsterList .v-list-item .v-list-item__content > div {
  width: calc(25% - 5px);
  position: relative;
  text-align: center;
}
#addMonsterList .v-list-item .v-list-item__content > div.active:after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  background: url("/_nuxt/assets/images/checked.png") no-repeat;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
}
#addMonsterList .v-list-item .v-list-item__content img {
  display: block;
  width: 100%;
}
</style>
