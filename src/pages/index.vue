<template>
  <div>
    <v-btn @click="add()">추가</v-btn>
    <!-- <v-autocomplete
      v-model="friends"
      :disabled="isUpdating"
      :items="people"
      chips
      closable-chips
      color="blue-grey-lighten-2"
      item-title="name"
      item-value="name"
      label="Select"
      multiple
    >
      <template v-slot:chip="{ props, item }">
        <v-chip
          v-bind="props"
          :prepend-avatar="item.raw.avatar"
          :text="item.raw.name"
        ></v-chip>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="item?.raw?.avatar"
          :title="item?.raw?.name"
          :subtitle="item?.raw?.group"
        ></v-list-item>
      </template>
    </v-autocomplete> -->
    <v-container>
      <v-row justify="center" align="center" id="monsterList">
        <v-col cols="12">
          <v-row class="header">
            <v-col cols="6">
              방덱 리스트
            </v-col>
            <v-col cols="2">
              승률
            </v-col>
            <v-col cols="2">
              승리
            </v-col>
            <v-col cols="2">
              패배
            </v-col>
          </v-row>
          <v-row v-for="monster in monsterList" :key="monster.team_id">
            <v-col cols="6" @click="goDetail(monster.team_id)">
              <img :src="require(`../assets${monster.image_url1}`)" />
              <img :src="require(`../assets${monster.image_url2}`)" />
              <img :src="require(`../assets${monster.image_url3}`)" />
            </v-col>
            <v-col cols="2">
              {{ monster.rate }}
            </v-col>
            <v-col cols="2">
              {{ monster.victory_count }}
            </v-col>
            <v-col cols="2">
              {{ monster.defeat_count }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <addpopup ref="addpopup" />
  </div>
</template>

<script>
import addpopup from './addpopup.vue'

export default {
  components: {
    addpopup,
  },
  data () {
    return {
      // loading: false,
      schData: {

      },
      monsterList: [],
      monsterNameList: [],
    }
  },
  async mounted() {
    await this.search()
  },
  methods: {
    async search() {
      await this.$axios.get('/api/v1/summonerswar/enemyTeam-list', {params: this.schData}).then((res) => {
        this.monsterList = res.data
      })
      await this.$axios.get('/api/v1/summonerswar/monster-list', {params: this.schData}).then((res) => {
        res.data.forEach(e => {
          e.monster_
        })
        this.monsterNameList.push()
      })
    },
    goDetail(team_id) {
      this.$router.push({
        name: 'detail-detail',
        params: {
          detail: team_id,
          team_id: team_id,
        },
      })
    },
    add() {
      this.$refs.addpopup.open('bang')
    },
  },
}
</script>
<style scoped>
#monsterList .header {
  height: 50px;
}
#monsterList .col-12 .row {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px auto;
  font-size: 12px;
  text-align: center;
  color: #000;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58,57,165,.1);
  border-radius: 4px;
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