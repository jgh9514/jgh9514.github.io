<template>
  <div class="page-container">
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    
      <!-- 데이터 상태 표시 -->
      <div v-if="!loading && siegeList.length === 0" class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-database-off</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">점령전 데이터가 없습니다</h3>
        <p class="text-body-2 text-grey">현재 등록된 점령전 이력이 없습니다.</p>
        <v-btn 
          color="primary" 
          variant="outlined" 
          class="mt-4"
          @click="getSiegeHistory"
        >
          새로고침
        </v-btn>
      </div>
      
      <!-- 카드 형태로 표시 -->
      <div v-if="siegeList.length > 0" class="siege-cards">
        <v-card
          v-for="item in siegeList"
          :key="item.match_id"
          class="siege-card mb-4"
          elevation="2"
          @click="showMatchDetail(item)"
        >
                                 <!-- 점령전 일시 헤더 -->
            <v-card-title class="text-center pa-4 pb-2">
              <div class="d-flex flex-column align-center">
                <div class="text-h6 font-weight-bold">
                  {{ formatDate(item.match_id) }}
                </div>
              </div>
            </v-card-title>
          
          <!-- 3파전 길드 정보 -->
          <v-card-text class="pa-4 pt-0">
                         <div class="guilds-container">
                               <!-- 1등 길드 -->
                <div class="guild-card first-place">
                  <div class="guild-info">
                    <div class="guild-name">{{ item.guild_1st }}</div>
                    <div class="guild-rating">
                      <div class="rating-stars">
                        <v-icon 
                          v-for="i in getRatingStars(item.rating_1st)" 
                          :key="`star-1st-${i}`"
                          :style="{ color: getRatingColor(item.rating_1st) }"
                          size="12"
                        >
                          mdi-star
                        </v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 2등 길드 -->
                <div class="guild-card second-place">
                  <div class="guild-info">
                    <div class="guild-name">{{ item.guild_2nd }}</div>
                    <div class="guild-rating">
                      <div class="rating-stars">
                        <v-icon 
                          v-for="i in getRatingStars(item.rating_2nd)" 
                          :key="`star-2nd-${i}`"
                          :style="{ color: getRatingColor(item.rating_2nd) }"
                          size="12"
                        >
                          mdi-star
                        </v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 3등 길드 -->
                <div class="guild-card third-place">
                  <div class="guild-info">
                    <div class="guild-name">{{ item.guild_3rd }}</div>
                    <div class="guild-rating">
                      <div class="rating-stars">
                        <v-icon 
                          v-for="i in getRatingStars(item.rating_3rd)" 
                          :key="`star-3rd-${i}`"
                          :style="{ color: getRatingColor(item.rating_3rd) }"
                          size="12"
                        >
                          mdi-star
                        </v-icon>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </v-card-text>
        </v-card>
      </div>

    <div v-if="!loading && siegeList.length > 0" class="text-center">
      <div class="pagination">
        <button class="page-btn" @click="prevPage" :disabled="schData.offset === 1">
          <v-icon>mdi-menu-left</v-icon>
        </button>
        <button
          v-for="pageNum in displayPages"
          :key="pageNum"
          class="page-btn"
          :class="{ active: pageNum === schData.offset }"
          @click="changePage(pageNum)"
        >
          {{ pageNum }}
        </button>
        <button
          class="page-btn"
          @click="nextPage"
          :disabled="schData.offset >= totalPage"
        >
          <v-icon>mdi-menu-right</v-icon>
        </button>
      </div>
      <v-select
        v-model="schData.paging"
        :items="listData"
        item-title="cd_nm"
        item-value="cd"
        variant="outlined"
        style="padding: 0 20px; width: 200px; float: right"
        @update:model-value="viewCountChange"
      ></v-select>
    </div>
  </div>
</template>

<script setup>
import { Constants } from '~/utils/constants';

const schData = ref({ paging: 5, offset: 1 });
const siegeList = ref([]);
const loading = ref(false);
const totalPage = ref(0);
const totalCount = ref(0);
const guildCount = ref(0);

const listData = [
  { cd: 5, cd_nm: "5개씩 보기" },
  { cd: 10, cd_nm: "10개씩 보기" },
  { cd: 15, cd_nm: "15개씩 보기" },
];

onMounted(async () => {
  await getSiegeHistory();
});

const getSiegeHistory = async () => {
  try {
    loading.value = true;
    
    // 페이지네이션 파라미터 계산
    const page = schData.value.offset;
    const limit = schData.value.paging;
    const offset = (page - 1) * limit;
    
    const searchData = {
      ...$gfn_searchDataExtraction(schData.value),
      limit: limit,
      offset: offset,
      page: page
    };
    
    // 전체 개수 조회
    const totalCountRes = await $api.get("/summonerswar/guild-siege-history-count");
    console.log(totalCountRes);
    if (totalCount) {
      totalCount.value = totalCountRes;
      totalPage.value = Math.ceil(totalCountRes / limit);
    }
    
    // 데이터 조회
    const res = await $api.get("/summonerswar/guild-siege-history", searchData);
    
    // API 응답 구조 확인 및 데이터 처리
    if (res && Array.isArray(res)) {
      // 배열로 직접 반환되는 경우
      siegeList.value = [...res];
      guildCount.value = res.length > 0 ? res[0].guild_count || 0 : 0;
    }
    
  } catch (error) {
    console.error('점령전 이력 조회 실패:', error);
    $toast("점령전 이력을 불러오는데 실패했습니다.", "error");
    siegeList.value = [];
    totalCount.value = 0;
    guildCount.value = 0;
    totalPage.value = 0;
  } finally {
    loading.value = false;
  }
};

const showMatchDetail = (item) => {
  // 길드 정보를 sessionStorage에 저장 (길드 ID 포함)
  const guilds = [
    { guild_id: item.guild_id_1st, guild_name: item.guild_1st, rating: item.rating_1st },
    { guild_id: item.guild_id_2nd, guild_name: item.guild_2nd, rating: item.rating_2nd },
    { guild_id: item.guild_id_3rd, guild_name: item.guild_3rd, rating: item.rating_3rd }
  ].filter(guild => guild.guild_name); // 빈 값 제거
  
  // sessionStorage에 길드 정보 저장
  sessionStorage.setItem(`siege_guilds_${item.match_id}`, JSON.stringify(guilds));
  
  navigateTo({
    path: `/siege/${item.match_id}`
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // match_id 형식: "2025080401000005" 
    // YYYYMM + 주차(2자리) + 요일(01=월요일, 02=목요일) + 나머지
    if (dateString.length === 16) {
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6));
      const weekNum = parseInt(dateString.substring(6, 8));
      const dayOfWeek = dateString.substring(8, 10);
      
      // dayjs를 사용하여 날짜 계산
      const $dayjs = useNuxtApp().$dayjs;
      
      // weekNum은 해당 월의 주차를 의미
      // 월요일 기준으로 주차 계산
      const firstDayOfMonth = new Date(year, month - 1, 1); // 8월 1일
      const firstDayOfMonthWeekday = firstDayOfMonth.getDay(); // 0=일요일, 1=월요일, 2=화요일...
      
      // 해당 월의 첫 번째 월요일 찾기 (이전 월에서 시작할 수 있음)
      let firstMondayOfMonth = new Date(firstDayOfMonth);
      while (firstMondayOfMonth.getDay() !== 1) { // 1 = 월요일
        firstMondayOfMonth.setDate(firstMondayOfMonth.getDate() - 1); // 이전 날짜로
      }
      
      // 목표 주차의 월요일 계산 (첫 번째 월요일부터 시작)
      const targetDate = new Date(firstMondayOfMonth);
      targetDate.setDate(firstMondayOfMonth.getDate() + (weekNum - 1) * 7);
      
      // dayjs 객체로 변환
      let targetDateDayjs = $dayjs(targetDate);
      
      // 요일에 따라 날짜 조정
      if (dayOfWeek === '01') { // 월요일
        // 이미 월요일이므로 추가 조정 불필요
      } else if (dayOfWeek === '02') { // 목요일
        targetDateDayjs = targetDateDayjs.add(3, 'day'); // 월요일 + 3일 = 목요일
      }
      
      // 날짜가 해당 월을 벗어나면 조정
      if (targetDateDayjs.month() !== month - 1) {
        // 해당 월의 마지막 날짜로 조정
        const lastDayOfMonth = firstDayOfMonth.endOf('month');
        targetDateDayjs = lastDayOfMonth;
      }
      
      const result = targetDateDayjs.format('YYYY-MM-DD');
      
      return result;
    }
    
    // ISO 형식이나 다른 형식 시도
    const $dayjs = useNuxtApp().$dayjs;
    const date = $dayjs(dateString);
    
    if (!date.isValid()) {
      return dateString; // 파싱 실패 시 원본 문자열 반환
    }
    
    return date.format('YYYY-MM-DD');
  } catch (error) {
    console.warn('날짜 파싱 실패:', dateString, error);
    return dateString; // 에러 시 원본 문자열 반환
  }
};

const formatDateDetail = (dateString) => {
  if (!dateString) return '-';
  
  try {
    if (dateString.length === 16) {
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6));
      const weekNum = parseInt(dateString.substring(6, 8));
      const dayOfWeek = dateString.substring(8, 10);
      
      const $dayjs = useNuxtApp().$dayjs;
      let targetDateDayjs = $dayjs().year(year).week(weekNum).day(1);
      
      if (dayOfWeek === '02') { // 목요일
        targetDateDayjs = targetDateDayjs.add(3, 'day');
      }
      
      const dayName = targetDateDayjs.format('dddd');
      const weekText = `${weekNum}주차`;
      const dayText = dayOfWeek === '01' ? '월요일' : '목요일';
      
      return `${weekText} ${dayText} (${dayName})`;
    }
    
    return dateString;
  } catch (error) {
    return dateString;
  }
};



const displayPages = computed(() => {
  const pages = [];
  const totalPages = totalPage.value;
  const currentPage = schData.value.offset;

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = Math.max(1, totalPages - 4); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pages.push(i);
      }
    }
  }
  return pages;
});

const prevPage = () => {
  if (schData.value.offset > 1) {
    schData.value.offset--;
    getSiegeHistory();
  }
};

const nextPage = () => {
  if (schData.value.offset < totalPage.value) {
    schData.value.offset++;
    getSiegeHistory();
  }
};

const changePage = (page) => {
  schData.value.offset = page;
  getSiegeHistory();
};

const viewCountChange = () => {
  schData.value.offset = 1;
  getSiegeHistory();
};

// RTA 파일에서 가져온 별점 변환 함수들
const getRatingColor = (rating) => {
  if (!rating || isNaN(rating)) return '#999'
  const ratingNum = parseInt(rating)
  if (ratingNum >= 4000) return '#ff3e00'
  if (ratingNum >= 3000) return '#00baad'
  if (ratingNum >= 2000) return '#ffc300'
  return '#999'
}

const getRatingStars = (rating) => {
  if (!rating || isNaN(rating)) return 0
  const ratingNum = parseInt(rating)
  if (isNaN(ratingNum)) return 0
  const onesDigit = ratingNum % 10
  return Math.min(Math.max(onesDigit, 0), 3) // 0~3 범위로 제한
}
</script>
<style>
/* 페이지 전체 컨테이너 */
.page-container {
  max-width: 100%;
}
</style>
<style scoped>
/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.pagination-info {
  text-align: center;
  margin: 10px 0;
}

.page-info {
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.page-btn.active {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 카드 스타일 */
.siege-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.siege-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.siege-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* 길드 컨테이너 */
.guilds-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: nowrap;
  padding: 16px 0;
}

/* 길드 카드 */
.guild-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px 16px 12px;
  border-radius: 12px;
  min-height: 100px;
  min-width: 120px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.guild-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.guild-card .rank-badge {
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  margin-bottom: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guild-card .guild-info {
  flex: 1;
  margin-top: 8px;
}

.guild-card .guild-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 4px;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.guild-card .guild-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.guild-card .rating-stars {
  display: flex;
  gap: 1px;
  justify-content: center;
}

.guild-card .rating-score {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}



/* 길드 순위별 스타일 */
.first-place {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: 3px solid #ffd700;
  position: relative;
}

.first-place::before {
  content: '🥇';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.second-place {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  border: 3px solid #c0c0c0;
  position: relative;
}

.second-place::before {
  content: '🥈';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.third-place {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  border: 3px solid #cd7f32;
  position: relative;
}

.third-place::before {
  content: '🥉';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* 메달 색상 */
.rank-1st {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: 2px solid #ffd700;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.rank-2nd {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  border: 2px solid #c0c0c0;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3);
}

.rank-3rd {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  border: 2px solid #cd7f32;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.3);
}

/* 순위 텍스트 스타일 */
.rank-text {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}

/* 추가 정보 */
.additional-info {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .siege-card { margin: 0 4px; }
  .guilds-container { 
    gap: 8px; 
    padding: 12px 0;
  }
  .guild-card {
    padding: 12px 8px;
    min-height: 80px;
    min-width: 100px;
  }
  .guild-card .guild-name { font-size: 14px; }
  .guild-card .guild-rating { font-size: 12px; }
  .guild-card .rank-badge {
    width: 32px;
    height: 32px;
    padding: 6px;
  }
}
</style>
