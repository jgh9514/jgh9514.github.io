<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>점령전 {{ type == 1 ? '방덱' : '공덱' }} 추가</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              @click="save"
            >
              저장
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list lines="two" id="occupation">
          <v-list-item>
					  <div :class="selectedMonsterList.length > 0 ? '' : 'leader'">
              <img v-if="selectedMonsterList[0]" :src="require(`@/assets${selectedMonsterList[0].image_url}`)" @click="monsterSelected(selectedMonsterList[0])" />
              <img v-if="!selectedMonsterList[0]" :src="require(`@/assets/images/unit_select_icon.png`)" />
            </div>
					  <div>
              <img v-if="selectedMonsterList[1]" :src="require(`@/assets${selectedMonsterList[1].image_url}`)" @click="monsterSelected(selectedMonsterList[1])" />
              <img v-if="!selectedMonsterList[1]" :src="require(`@/assets/images/unit_select_icon.png`)" />
            </div>
					  <div>
              <img v-if="selectedMonsterList[2]" :src="require(`@/assets${selectedMonsterList[2].image_url}`)" @click="monsterSelected(selectedMonsterList[2])" />
              <img v-if="!selectedMonsterList[2]" :src="require(`@/assets/images/unit_select_icon.png`)" />
            </div>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-tabs id="elemental" bg-color="deep-purple-darken-4" center-active>
          <v-tab @click="tabChange('Fire_a')"><img :src="require(`@/assets/images/Fire_Icon.png`)" /></v-tab>
          <v-tab @click="tabChange('Water_a')"><img :src="require(`@/assets/images/Water_Icon.png`)" /></v-tab>
          <v-tab @click="tabChange('Wind_a')"><img :src="require(`@/assets/images/Wind_Icon.png`)" /></v-tab>
          <v-tab @click="tabChange('Light_a')"><img :src="require(`@/assets/images/Light_Icon.png`)" /></v-tab>
          <v-tab @click="tabChange('Dark_a')"><img :src="require(`@/assets/images/Dark_Icon.png`)" /></v-tab>
        </v-tabs>
        <v-list lines="two" id="monsterList">
          <v-list-item>
            <div v-for="monster in monsterListFilter" :key="monster.id" :class="monster.active ? 'active' : ''" @click="monsterSelected(monster)">
              <img :src="require(`@/assets${monster.image_url}`)" />
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      type: 0,
      enemy_team_id: '',
      dialog: false,
      monsterList: [],
      monsterListFilter: [],
      selectedMonsterList: [],
    }
  },
  async mounted() {
    await this.search()
  },
  methods: {
    open(type, enemy_team_id) {
      if (type == 'bang') {
        this.type = 1
      } else if (type == 'empty') {
        this.type = 2
        this.enemy_team_id = enemy_team_id
      }
      this.dialog = true
    },
    async search() {
      await this.$axios.get('/api/v1/summonerswar/monster-list', {params: this.schData}).then((res) => {
        this.monsterList = res.data
        this.tabChange('Fire_a')
      })
    },
    tabChange(val) {
      this.monsterListFilter = this.monsterList.filter(e => {
        return e.monster_elemental == val
      })
    },
    monsterSelected(monster) {
      if (monster.active) {
        this.selectedMonsterList = this.selectedMonsterList.filter(e => {
          return e.monster_id != monster.monster_id
        })
      } else {
        if (this.selectedMonsterList.length > 2) {
          return
        }
        this.selectedMonsterList.push(monster)
      }
      monster.active = !monster.active
    },
    async save() {
      if (this.selectedMonsterList.length != 3) {
        return
      }
      const saveData = {
        type: this.type,
        enemy_team_id: this.enemy_team_id,
        monster_1: this.selectedMonsterList[0].monster_id,
        monster_2: this.selectedMonsterList[1].monster_id,
        monster_3: this.selectedMonsterList[2].monster_id,
      }
      await this.$axios.post('/api/v1/summonerswar/enemyTeam-save', saveData).then((res) => {
        if (res.data == 'SUCCESS') {
          this.$toast.show('저장되었습니다.')
          this.close()
        }
        console.log(res)
      })
    },
    close() {
      this.selectedMonsterList = []
      this.dialog = false
      this.$emit('close')
    }
  },
}
</script>
<style scoped>
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
  transition: transform .2s ease-in-out;
}
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
#monsterList {
  height: 500px;
  overflow-y: scroll;
}
#monsterList .v-list-item {
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 0;
}
#monsterList .v-list-item > div {
  width: 33%;
  flex: 1;
  position: relative;
}
#monsterList .v-list-item > div.active:after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  background: url('/_nuxt/assets/images/checked.png') no-repeat;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
}
</style>