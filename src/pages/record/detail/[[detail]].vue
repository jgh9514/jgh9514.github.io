<template>
  <div>
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    <v-container class="monsterList">
      <div v-if="groupedBattles.length === 0" class="text-center pa-8">
        <p class="text-grey">전적 데이터가 없습니다.</p>
      </div>
      
      <div v-else>
        <div
          v-for="(group, groupIndex) in groupedBattles"
          :key="groupIndex"
          class="battle-group"
        >
          <!-- 그룹 헤더: 날짜 + 길드 vs 길드 vs 길드 -->
          <div class="group-header-cell">
            <div class="group-header-content">
              <div class="group-header-main">
                <span class="group-date">{{ group.dateLabel }}</span>
                <span class="group-guilds">{{ group.guildsLabel }}</span>
              </div>
              <div class="group-sub">
                {{ group.battles.length }}전 {{ group.winCount }}승 {{ group.loseCount }}패
              </div>
            </div>
          </div>

          <!-- 전투 로그 리스트 -->
          <div class="battles-list">
            <div
              v-for="(item, idx) in group.battles"
              :key="idx"
              class="battle-item"
            >
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
            </div>
          </div>
        </div>
      </div>
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
  try {
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.post("/summonerswar/record-detail", searchData);
    // 백엔드에서 List<Map<String, ?>> 로 반환되므로 배열 처리
    userList.value = Array.isArray(res) ? [...res] : [];
  console.log(userList.value);
  } catch (error) {
    console.error("전적 상세 조회 실패:", error);
    userList.value = [];
    $toast("전적 상세 정보를 불러오는데 실패했습니다.", "error");
  }
};

// match_id 형식(예: 2025080401000005)을 YYYY-MM-DD로 변환
const formatMatchDate = (matchId) => {
  if (!matchId) return '날짜 없음';

  // 숫자형으로 들어올 수도 있으니 문자열로 변환
  const dateString = String(matchId);

  try {
    if (dateString.length === 16) {
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6));
      const weekNum = parseInt(dateString.substring(6, 8));
      const dayOfWeek = dateString.substring(8, 10);

      const $dayjs = useNuxtApp().$dayjs;

      const firstDayOfMonth = new Date(year, month - 1, 1);
      let firstMondayOfMonth = new Date(firstDayOfMonth);
      while (firstMondayOfMonth.getDay() !== 1) {
        firstMondayOfMonth.setDate(firstMondayOfMonth.getDate() - 1);
      }

      const targetDate = new Date(firstMondayOfMonth);
      targetDate.setDate(firstMondayOfMonth.getDate() + (weekNum - 1) * 7);

      let targetDateDayjs = $dayjs(targetDate);

      if (dayOfWeek === "02") {
        targetDateDayjs = targetDateDayjs.add(3, "day");
      }

      if (targetDateDayjs.month() !== month - 1) {
        const lastDayOfMonth = $dayjs(firstDayOfMonth).endOf("month");
        targetDateDayjs = lastDayOfMonth;
      }

      return targetDateDayjs.format("YYYY-MM-DD");
    }

    // 그 외에는 dayjs로 포맷 시도
    const $dayjs = useNuxtApp().$dayjs;
    const date = $dayjs(dateString);
    if (!date.isValid()) {
      return dateString;
    }
    return date.format("YYYY-MM-DD");
  } catch (error) {
    return dateString;
  }
};

// 전투 로그를 match_id(점령전 기준)별로 그룹화
const groupedBattles = computed(() => {
  if (!userList.value || userList.value.length === 0) {
    return [];
  }

  // match_id 필드 우선 사용
  const firstItem = userList.value[0];
  const matchIdFieldName = Object.keys(firstItem).find((key) =>
    key.toLowerCase().includes("match_id")
  );

  if (!matchIdFieldName) {
    // match_id가 없으면 전체를 하나의 그룹으로
    const uniqueGuilds = [...new Set(userList.value.map(item => item.opp_guild_name).filter(Boolean))];
    const winCount = userList.value.filter(item => item.win_lose === '1').length;
    const loseCount = userList.value.length - winCount;
    return [{
      dateLabel: "전체 전투 이력",
      guildsLabel: uniqueGuilds.length > 0 ? `상대 길드: ${uniqueGuilds.join(", ")}` : "",
      battles: userList.value,
      winCount,
      loseCount,
    }];
  }

  // match_id별로 그룹화
  const groups = {};
  userList.value.forEach(item => {
    const matchId = item[matchIdFieldName];
    const key = matchId || "NO_MATCH";
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  // match_id 기준으로 정렬 (최신 match_id 먼저)
  return Object.keys(groups)
    .sort((a, b) => String(b).localeCompare(String(a)))
    .map((matchKey) => {
      const battles = groups[matchKey];
      const sample = battles[0];

      const dateLabel = matchKey !== "NO_MATCH" ? formatMatchDate(matchKey) : "날짜 정보 없음";

      // 3파전 길드 정보가 있으면 그걸 사용, 없으면 공격/수비 길드들로 구성
      const guildNames = [];
      if (sample.guild_1st || sample.guild_2nd || sample.guild_3rd) {
        if (sample.guild_1st) guildNames.push(sample.guild_1st);
        if (sample.guild_2nd) guildNames.push(sample.guild_2nd);
        if (sample.guild_3rd) guildNames.push(sample.guild_3rd);
      } else {
        const set = new Set();
        battles.forEach((item) => {
          if (item.guild_name) set.add(item.guild_name);
          if (item.opp_guild_name) set.add(item.opp_guild_name);
        });
        guildNames.push(...Array.from(set));
      }

      const guildsLabel =
        guildNames.length > 0 ? guildNames.join(" vs ") : "길드 정보 없음";

      const winCount = battles.filter(item => item.win_lose === '1').length;
      const loseCount = battles.length - winCount;

      return {
        dateLabel,
        guildsLabel,
        battles,
        winCount,
        loseCount,
      };
    });
});
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
  padding: 12px 16px;
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

/* 그룹 헤더/행 스타일 */
.battle-group {
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.group-header-cell {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  border-left: 4px solid #1976d2;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 20px;
}

.group-header-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.group-header-main {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: baseline;
}

.group-date {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
}

.group-guilds {
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
}

.group-sub {
  font-size: 0.85rem;
  color: #6b7280;
}

.battles-list {
  padding: 8px;
}

.battle-item {
  margin-bottom: 8px;
}

.battle-item:last-child {
  margin-bottom: 0;
}

.battle-row {
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 14px 18px;
  transition: all 0.2s ease;
}

.battle-row:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
