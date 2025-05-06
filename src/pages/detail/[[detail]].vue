<template>
  <div>
    <div id="defenceInfo" v-for="data in enemyData" :key="data.team_id">
      <div class="title" style="position: relative">
        <p>점령전 방덱</p>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <img
                  v-if="data.image_url1"
                  :src="`${Constants.BASE_URL}${data.image_url1}`"
                />
                <p class="text-center">{{ data.m1_kr_name }}</p>
              </v-col>
              <v-col cols="4">
                <img
                  v-if="data.image_url2"
                  :src="`${Constants.BASE_URL}${data.image_url2}`"
                />
                <p class="text-center">{{ data.m2_kr_name }}</p>
              </v-col>
              <v-col cols="4">
                <img
                  v-if="data.image_url3"
                  :src="`${Constants.BASE_URL}${data.image_url3}`"
                />
                <p class="text-center">{{ data.m3_kr_name }}</p>
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
            <p class="data">{{ data.total_rate + "%" }}</p>
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
    <v-container class="monsterList">
      <div
        class="title"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        "
      >
        <p>점령전 추천 공덱</p>
        <v-btn @click="add">추가</v-btn>
      </div>
      <v-data-table
        :headers="[
          {
            title: '공덱 리스트',
            key: 'monsters',
            align: 'start',
            width: '50%',
            sortable: false,
          },
          {
            title: '승률',
            key: 'total_rate',
            align: 'center',
            width: '50%',
            sortable: false,
          },
        ]"
        :items="recommendedList"
        hide-default-footer
        :items-per-page="200"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
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
            <td style="padding: 10px 5px">코멘트</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
    <v-container class="monsterList">
      <div class="title">
        <p>점령전 공격 이력</p>
      </div>
      <v-data-table
        :headers="[
          {
            title: '공덱 리스트',
            key: 'monsters',
            align: 'start',
            width: '50%',
            sortable: false,
          },
          {
            title: '승률',
            key: 'total_rate',
            align: 'center',
            width: '50%',
            sortable: false,
          },
        ]"
        :items="historyList"
        hide-default-footer
        :items-per-page="200"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
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
            <td style="padding: 10px 5px">
              <span
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 5px;
                "
              >
                <span>({{ item.total_rate + "%" }})</span>
                <span>{{ item.win_count }}승 {{ item.lose_count }}패</span>
              </span>
              <span>
                <v-progress-linear
                  :model-value="item.total_rate"
                  color="primary"
                  height="10"
                  rounded
                />
              </span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
    <addpopup ref="addpopupRef" @close="popClose" />
  </div>
</template>

<script setup>
import addpopup from "@pages/addpopup.vue";

const urlParams = $gfn_getUrlParams();

const schData = ref({});
const enemyData = ref({});
const historyList = ref([]);
const recommendedList = ref([]);

const addpopupRef = ref(null);

onMounted(async () => {
  const dm = urlParams.detail.split("-");
  schData.value.dm1 = dm[0];
  schData.value.dm2 = dm[1];
  schData.value.dm3 = dm[2];
  await search();
});

const search = async () => {
  const res = await $api.get("/summonerswar/monster-detail-list", schData.value);
  enemyData.value = res.enemyData;
  historyList.value = res.historyList;
  recommendedList.value = res.recommendedList;
};

const add = () => {
  const teamData = {
    dm1: schData.value.dm1,
    dm2: schData.value.dm2,
    dm3: schData.value.dm3,
  };
  addpopupRef.value.open("empty", teamData);
};

const popClose = () => {
  search();
};
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

#defenceInfo {
  margin-top: 10px;
  height: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

#defenceInfo .title {
  display: flex;
  flex-direction: row;
  padding: 9px 0;
  height: 50px;
  border-bottom: solid rgba(56, 56, 56, 0.3);
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 auto;
  align-items: center;
}

#defenceInfo > .row {
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
}

#defenceInfo .col-12 .row {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px auto;
  font-size: 12px;
  text-align: center;
  color: #000;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
}

#defenceInfo .col-4 {
  text-align: center;
  float: left;
  padding: 0 10px;
}

#defenceInfo img {
  width: 100%;
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
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
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
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

#TeamAnalysis {
  height: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58, 57, 165, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

#TeamAnalysis .title {
  display: flex;
  flex-direction: row;
  padding: 9px 0;
  height: 50px;
  border-bottom: solid rgba(56, 56, 56, 0.3);
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 0 auto;
  align-items: center;
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
  background: linear-gradient(
    90deg,
    rgb(255, 62, 0) 0%,
    rgb(255, 205, 135) 100%
  ) !important;
}
</style>
