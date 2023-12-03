<template>
  <div style="padding: 0 10px;">
    <div>
      <v-icon @click="goHome()">mdi-chevron-left</v-icon>
    </div>
    <div id="title">
      <h3>Season:S26 - Version:V8.0.5</h3>
    </div>
    <div id="monsterList" v-for="data in enemyData" :key="data.team_id">
      <div class="title" style="position: relative;">
        <p>점령전 방덱</p>
        <v-btn style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);" @click="remove()">삭제</v-btn>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <img :src="require(`../../assets${data.image_url1}`)" />
              </v-col>
              <v-col cols="4">
                <img :src="require(`../../assets${data.image_url2}`)" />
              </v-col>
              <v-col cols="4">
                <img :src="require(`../../assets${data.image_url3}`)" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row class="baseInfoHeader">
          <v-col cols="12">
            <p>Base info</p>
          </v-col>
        </v-row>
        <v-row class="baseInfo">
          <v-col cols="3">
            <p class="data">{{ data.total_rate }}</p>
            <p>공성률</p>
          </v-col>
          <v-col cols="3">
            <p class="data">{{ data.total_count }}</p>
            <p>총 게임 수</p>
          </v-col>
          <v-col cols="3">
            <p class="data">{{ data.win_count }}</p>
            <p>승리 수</p>
          </v-col>
          <v-col cols="3">
            <p class="data">{{ data.lose_count }}</p>
            <p>패배 수</p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div id="TeamAnalysis">
      <div class="title" style="position: relative;">
        <p>점령전 공덱</p>
        <v-btn style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);" @click="add()">추가</v-btn>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row style="text-align: center">
              <v-col cols="6">조합 리스트</v-col>
              <v-col cols="6">승률</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="TeamAnalysis_body">
            <v-row v-for="monster in teamList" :key="monster.team_id">
              <v-col cols="6">
                <img :src="require(`../../assets${monster.image_url1}`)" />
                <img :src="require(`../../assets${monster.image_url2}`)" />
                <img :src="require(`../../assets${monster.image_url3}`)" />
              </v-col>
              <v-col cols="6" style="padding-left: 0;">
                <p>{{ monster.win_count / monster.total_count * 100 }}%</p>
                <v-progress-linear 
                  color="orange" 
                  :value="monster.win_count / monster.total_count * 100" 
                  height="10">
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <addpopup ref="addpopup" @close="popClose()" />
  </div>
</template>

<script>
import addpopup from '../addpopup.vue'
export default {
  components: {
    addpopup,
  },
  meta: {
    title: '점령전 방덱 상세',
    key(route) {
      return `/detail/${route.params.catalog}`
    },
  },
  data () {
    return {
      schData: {},
      enemyData: {},
      teamList: [],
    }
  },
  async mounted() {
    console.log(this.$route.params.dm1)
    if (this.$route.params.detail != undefined) {
      this.schData.team_id = this.$route.params.detail
      this.schData.dm1 = this.$route.params.dm1
      this.schData.dm2 = this.$route.params.dm2
      this.schData.dm3 = this.$route.params.dm3
    }
    await this.search()
  },
  methods: {
    async search() {
      await this.$axios.get('/api/v1/summonerswar/monster-detail-list', {params: this.schData}).then((res) => {
        this.enemyData = res.data.enemyData
        this.teamList = res.data.teamList
      })
    },
    goHome() {
      this.$router.push({
        name: 'index',
      })
    },
    add() {
      this.$refs.addpopup.open('empty', this.schData.team_id)
    },
    popClose() {
      this.search()
    }
  },
}
</script>
<style scoped>
#title h3 {
  display: table;
  font-size: 15px;
  font-weight: bold;
  box-sizing: border-box;
  padding: 3px 10px;
  background: #cccccc;
  border-radius: 10px;
  margin: 0 10px;
}
#monsterList {
  margin-top: 10px;
  height: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58,57,165,.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
#monsterList .title {
  display: flex;
  flex-direction: row;
  padding: 9px 5.33%;
  height: 50px;
  border-bottom: solid rgba(56, 56, 56, 0.3);
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 auto;
}
#monsterList > .row {
    box-shadow: 0 0 10px rgba(58,57,165,.1);
    border-radius: 4px;
}
#monsterList .col-12 .row {
  display: table;
  margin: 0 auto;
}

#monsterList .col-4 {
  text-align: center;
  float: left;
  padding: 0 10px;
}
#monsterList img {
  border-radius: 5px;
  border: 4px solid #d79f34;
}

.baseInfo {
  font-size: 12px;
  text-align: center; 
  justify-content: space-between;
  box-shadow: none !important;
}
.baseInfo .col-3 {
  box-shadow: 0 0 10px rgba(58,57,165,.1);
  border-radius: 4px;
  width: 24%;
  flex-grow: unset;
}
.baseInfo .data {
  box-sizing: border-box;
  padding: 10px 0;
  font-size: 17px;
  font-weight: bold;
}
.baseInfoHeader {
  font-size: 12px;
  text-align: center;
  color: #000;
  height: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58,57,165,.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
#TeamAnalysis {
  height: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58,57,165,.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
#TeamAnalysis .title {
  display: flex;
  flex-direction: row;
  padding: 9px 5.33%;
  height: 50px;
  border-bottom: solid rgba(56, 56, 56, 0.3);
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 auto;
}
#TeamAnalysis .TeamAnalysis_body {
  display: flex;
  flex-wrap: wrap;
}
#TeamAnalysis .TeamAnalysis_body img {
  float: left;
  margin-left: -10px;
  width: 33.3%;
  border: 2px solid #fff;
  border-radius: 50%;
  box-sizing: border-box;
}
#TeamAnalysis .TeamAnalysis_body img:first-child {
  margin-left: 0 !important;
}
#TeamAnalysis .TeamAnalysis_body p {
  color: rgb(255, 62, 0);
  margin-bottom: 7px;
}
.v-application p {
  margin: 0;
  line-height: 1;
}
.v-application .primary {
  background: linear-gradient(90deg, rgb(255, 62, 0) 0%, rgb(255, 205, 135) 100%) !important;
}
</style>