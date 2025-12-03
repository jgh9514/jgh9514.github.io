<template>
  <div class="rta-page">
    <div class="content">
      <v-card class="data-card" v-if="rtaData">        
        <v-card-text>
          <!-- RTA 매치 목록 -->
          <div class="match-list-section">
            <h3 class="section-title">RTA 매치 목록</h3>
            
            <div class="match-list">
              <div 
                v-for="(match, index) in paginatedMatches" 
                :key="index"
                class="match-item"
                @click="toggleMatch(index)"
              >
                <!-- 매치 기본 정보 -->
                <div class="match-header">
                  <div class="match-player-left">
                    <div class="player-info">
                      <div class="player-avatar-score-container">
                        <div class="player-avatar-container">
                          <div class="player-avatar" :style="`background-image: url('https://swex.oss-cn-hangzhou.aliyuncs.com/playerImage/${match.p1Id || 'default'}.jpg')`"></div>
                          <v-icon v-if="match.winnerPosition === '1'" class="trophy-icon" style="color: #ffd700; font-size: 14px;">
                            mdi-trophy
                          </v-icon>
                        </div>
                        <div class="rating-score-container">
                          <div class="rating-stars">
                            <v-icon 
                              v-for="i in getRatingStars(match.p1Rating)" 
                              :key="i"
                              :style="{ color: getRatingColor(match.p1Rating) }"
                              size="12"
                            >
                              mdi-star
                            </v-icon>
                          </div>
                          <span class="player-score">{{ match.p1Score }}</span>
                        </div>
                      </div>
                      <div class="player-name-container">
                        <img v-if="match.p1Country" :src="`https://flagcdn.com/w40/${match.p1Country.toLowerCase()}.png`" :alt="match.p1Country" class="country-flag" />
                        <span class="player-name">{{ match.p1Name || 'Player' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="match-center">
                    <div class="match-date-time">{{ formatDate(match.date) }}</div>
                    <v-icon :class="{ 'rotated': expandedMatches[index] }" style="color: #999; font-size: 16px;">
                      mdi-chevron-down
                    </v-icon>
                  </div>
                  <div class="match-player-right">
                    <div class="player-info">
                      <div class="player-avatar-score-container">
                        <div class="rating-score-container">
                          <div class="rating-stars">
                            <v-icon 
                              v-for="i in getRatingStars(match.p2Rating)" 
                              :key="i"
                              :style="{ color: getRatingColor(match.p2Rating) }"
                              size="12"
                            >
                              mdi-star
                            </v-icon>
                          </div>
                          <span class="player-score">{{ match.p2Score }}</span>
                        </div>
                        <div class="player-avatar-container">
                          <div class="player-avatar" :style="`background-image: url('https://swex.oss-cn-hangzhou.aliyuncs.com/playerImage/${match.p2Id || 'default'}.jpg')`"></div>
                          <v-icon v-if="match.winnerPosition === '2'" class="trophy-icon" style="color: #ffd700; font-size: 14px;">
                            mdi-trophy
                          </v-icon>
                        </div>
                      </div>
                      <div class="player-name-container">
                        <span class="opponent-name">{{ match.p2Name || 'Opponent' }}</span>
                        <img v-if="match.p2Country" :src="`https://flagcdn.com/w40/${match.p2Country.toLowerCase()}.png`" :alt="match.p2Country" class="country-flag" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 확장된 몬스터 정보 -->
                <div v-if="expandedMatches[index]" class="match-details-expanded">
                  <div class="monster-battle-section">
                    <div class="player-monsters" :class="{ 'first-pick-player': isFirstPickPlayer(match), 'last-pick-player': !isFirstPickPlayer(match) }">
                      <div class="monster-grid">
                        <div 
                          v-for="(unit, unitIndex) in (match.p1Units || [])" 
                          :key="unitIndex"
                          class="monster-item"
                          :class="{ 'banned': unit.banned, 'leader': unit.leader }"
                        >
                          <div class="monster-image-wrapper">
                            <img 
                              :src="`${Constants.BASE_URL}${unit.image}`" 
                              :alt="unit.name"
                              @error="handleImageError"
                            />
                          </div>
                        </div>
                        <div v-if="!match.p1Units || match.p1Units.length === 0" class="no-data">
                          <p>몬스터 정보가 없습니다</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="vs-section">
                      <div class="vs-text">VS</div>
                    </div>
                    
                    <div class="player-monsters" :class="{ 'first-pick-player': !isFirstPickPlayer(match), 'last-pick-player': isFirstPickPlayer(match) }">
                      <div class="monster-grid">
                        <div 
                          v-for="(unit, unitIndex) in (match.p2Units || [])" 
                          :key="unitIndex"
                          class="monster-item"
                          :class="{ 'banned': unit.banned, 'leader': unit.leader }"
                        >
                          <div class="monster-image-wrapper">
                            <img 
                              :src="`${Constants.BASE_URL}${unit.image}`" 
                              :alt="unit.name"
                              @error="handleImageError"
                            />
                          </div>
                        </div>
                        <div v-if="!match.p2Units || match.p2Units.length === 0" class="no-data">
                          <p>몬스터 정보가 없습니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 페이지네이션 -->
          <div v-if="totalPages > 1" class="pagination-section">
            <div class="pagination-container">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                color="primary"
                @update:model-value="changePage"
              ></v-pagination>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card v-else-if="loading" class="loading-card">
        <v-card-text class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4">데이터를 불러오는 중...</div>
        </v-card-text>
      </v-card>

      <v-card v-else-if="error" class="error-card">
        <v-card-text class="text-center">
          <v-icon color="error" size="64">mdi-alert-circle</v-icon>
          <div class="mt-4 error-message">{{ error }}</div>
          <v-btn @click="fetchRtaData" color="primary" class="mt-4">
            다시 시도
          </v-btn>
        </v-card-text>
      </v-card>

      <v-card v-else class="empty-card">
        <v-card-text class="text-center">
          <v-icon size="64" color="grey">mdi-sword-cross</v-icon>
          <div class="mt-4">데이터가 없습니다</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Constants } from '~/utils/constants'

const rtaData = ref(null)
const loading = ref(true)
const error = ref(null)
const expandedMatches = ref({})
const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchRtaData = async (page = 1) => {
  try {
    loading.value = true
    error.value = null
    
    const [statsResponse, totalResponse, matchesResponse] = await Promise.all([
      $api.post('/rta/stat/list'),
      $api.post('/rta/match/count'),
      $api.post('/rta/match/list', { 
        limit: itemsPerPage.value, 
        offset: (page - 1) * itemsPerPage.value 
      })
    ])
    
    const totalMatches = totalResponse?.count || 0
    const matches = matchesResponse?.matches || matchesResponse || []
    
    rtaData.value = {
      totalMatches,
      todayMatches: statsResponse?.todayMatches || 0,
      weeklyMatches: statsResponse?.weeklyMatches || 0,
      recentMatches: matches.map(processMatchData),
      totalPages: Math.ceil(totalMatches / itemsPerPage.value),
      picks: []
    }
    
    if (matches.length > 0 && rtaData.value.recentMatches[0].p1Units.length > 0) {
      rtaData.value.picks = rtaData.value.recentMatches[0].p1Units
    }
  } catch (err) {
    error.value = '데이터를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const processMatchData = (match) => {
  const createUnits = (unitNames, unitImages, bannedUnit, leaderUnit) => {
    if (!Array.isArray(unitNames) || !Array.isArray(unitImages) || unitNames.length === 0) {
      return []
    }
    
    return unitNames.map((name, i) => ({
      name: name || `Unit ${i + 1}`,
      image: unitImages[i] || '/images/default-unit.png',
      banned: bannedUnit === (i + 1),
      leader: leaderUnit === (i + 1)
    }))
  }
  
  return {
    p1Name: match.p1_name || match.p1Name || match.p1_player_name || match.p1PlayerName || 'Player',
    p2Name: match.p2_name || match.p2Name || match.p2_player_name || match.p2PlayerName || 'Opponent',
    result: match.winner_position === "1" ? 'win' : 'lose',
    date: match.date_add || match.dateAdd || match.date || match.created_at || match.updated_at || new Date().toISOString(),
    p1Units: createUnits(match.p1_unit_names, match.p1_unit_images, match.p1_banned_unit, match.p1_leader_unit),
    p2Units: createUnits(match.p2_unit_names, match.p2_unit_images, match.p2_banned_unit, match.p2_leader_unit),
    p1PickOrder: match.p1_pick_order || [],
    p2PickOrder: match.p2_pick_order || [],
    p1FirstPick: match.p1_first_pick || "0",
    p2FirstPick: match.p2_first_pick || "0",
    p1Id: match.p1_wizard_id,
    p2Id: match.p2_wizard_id,
    winnerPosition: match.winner_position,
    p1Country: match.p1_country,
    p2Country: match.p2_country,
    p1Score: match.p1_score || match.p1Score || "0",
    p2Score: match.p2_score || match.p2Score || "0",
    p1Rating: match.p1_rating || match.p1Rating || "0",
    p2Rating: match.p2_rating || match.p2Rating || "0"
  }
}

const formatPercentage = (value) => {
  if (!value) return 0
  return Math.round(value * 100)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  const timeStr = `${hours}:${minutes}:${seconds}`
  return `${dateStr}\n${timeStr}`
}

const handleImageError = (event) => {
  const fallbackImage = `${Constants.BASE_URL}/images/Fire/Phoenix_Fire_Icon.png`
  event.target.src = fallbackImage
}

const toggleMatch = (index) => {
  expandedMatches.value[index] = !expandedMatches.value[index]
}

const isFirstPickPlayer = (match) => {
  // p1_first_pick이 "1"이거나 p2_first_pick이 "0"이면 p1이 첫 번째 픽
  return match.p1FirstPick === "1" || match.p2FirstPick === "0"
}

const isLastPickPlayer = (match) => {
  // p1_first_pick이 "0"이거나 p2_first_pick이 "1"이면 p2가 첫 번째 픽
  return match.p1FirstPick === "0" || match.p2FirstPick === "1"
}

const getRatingColor = (rating) => {
  const ratingNum = parseInt(rating)
  if (ratingNum >= 4000) return '#ff3e00'
  if (ratingNum >= 3000) return '#00baad'
  if (ratingNum >= 2000) return '#ffc300'
  return '#999'
}

const getRatingStars = (rating) => {
  const ratingNum = parseInt(rating)
  const onesDigit = ratingNum % 10
  return Math.min(onesDigit, 3) // 최대 3개까지만 표시
}

const paginatedMatches = computed(() => {
  return rtaData.value?.recentMatches || []
})

const totalPages = computed(() => {
  return rtaData.value?.totalPages || 1
})

const totalMatches = computed(() => {
  return rtaData.value?.totalMatches || 0
})

const changePage = async (page) => {
  currentPage.value = page
  // 페이지 변경 시 펼쳐진 매치들을 모두 닫기
  expandedMatches.value = {}
  // 새로운 페이지 데이터 로드
  await fetchRtaData(page)
}

onMounted(() => {
  fetchRtaData(1)
})
</script>

<style scoped>
.rta-page {
  background: #222;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  flex-direction: row;
  flex-shrink: 0;
}

.header-left {
  flex: 1;
  display: flex;
  justify-content: center;
}

.title {
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  text-align: center;
}

.player-names-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.player1-name, .player2-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.vs-text {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.content {
  flex: 1;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 32px);
}

.data-card {
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%) !important;
  color: #fff !important;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: calc(100vh - 100px);
}

.card-title {
  color: #fff !important;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-item {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.match-item:hover {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%) !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-direction: row;
}

.match-player-left, .match-player-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-player-left {
  justify-content: flex-start;
  text-align: left;
}

.match-player-right {
  justify-content: flex-end;
  text-align: right;
}

.match-center {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0 8px;
}

.match-date-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  white-space: pre-line;
  line-height: 1.2;
}

.match-result {
  font-size: 14px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 8px;
  color: #fff;
  min-width: 40px;
  text-align: center;
}

.match-result.win {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.match-result.lose {
  background: linear-gradient(45deg, #F44336, #d32f2f);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.match-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-names {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}



.match-player-left .player-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.match-player-right .player-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}



.player-avatar-score-container {
  display: flex;
  align-items: end;
  gap: 6px;
  flex-shrink: 0;
}

.match-player-left .player-avatar-score-container {
  justify-content: flex-start;
}

.match-player-right .player-avatar-score-container {
  justify-content: flex-end;
}

.match-player-left .rating-score-container {
  align-items: flex-start;
}

.match-player-right .rating-score-container {
  align-items: flex-end;
}

.player-avatar-container {
  position: relative;
  width: 48px;
  height: 48px;
  display: inline-block;
}

.player-avatar {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.trophy-icon {
  position: absolute;
  top: -6px;
  left: -6px;
  background: #fff;
  border-radius: 50%;
  padding: 3px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  pointer-events: none;
}

.player-name {
  font-weight: bold;
  color: #fff;
  text-align: left;
}

.player-name-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 30px;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.player-score {
  font-size: 11px;
  font-weight: bold;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  min-width: 25px;
  text-align: center;
  white-space: nowrap;
}

.country-flag {
  width: 32px;
  height: 24px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  object-fit: cover;
}

.pagination-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.pagination-container :deep(.v-pagination) {
  --v-pagination-item-size: 32px;
  --v-pagination-item-margin: 4px;
}

.pagination-container :deep(.v-btn) {
  width: inherit;
  height: inherit;
  font-size: 12px !important;
}
.pagination-container nav.v-pagination {
  width: 100%;
}

.pagination-container nav.v-pagination .v-pagination__list {
  justify-content: space-between;
}
.vs-text {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.opponent-name {
  font-size: 15px;
  font-weight: bold;
  color: #ddd;
  text-align: right;
}

.match-date {
  font-size: 12px;
  color: #999;
}

.match-toggle {
  transition: transform 0.3s ease;
}

.match-toggle .rotated {
  transform: rotate(180deg);
}

.match-details-expanded {
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.monster-battle-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.player-monsters, .opponent-monsters {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.first-pick-player .monster-grid {
  grid-template-areas:
    "fp-0 fp-1 fp-3"
    "fp-0 fp-2 fp-4";
}

.first-pick-player .monster-item:nth-child(1) {
  grid-area: fp-0;
  align-self: center;
}

.first-pick-player .monster-item:nth-child(2) {
  grid-area: fp-1;
}

.first-pick-player .monster-item:nth-child(3) {
  grid-area: fp-2;
}

.first-pick-player .monster-item:nth-child(4) {
  grid-area: fp-3;
}

.first-pick-player .monster-item:nth-child(5) {
  grid-area: fp-4;
}

.last-pick-player .monster-grid {
  grid-template-areas:
    "fp-1 fp-3 fp-5"
    "fp-2 fp-4 fp-5";
}

.last-pick-player .monster-item:nth-child(1) {
  grid-area: fp-1;
}

.last-pick-player .monster-item:nth-child(2) {
  grid-area: fp-2;
}

.last-pick-player .monster-item:nth-child(3) {
  grid-area: fp-3;
}

.last-pick-player .monster-item:nth-child(4) {
  grid-area: fp-4;
}

.last-pick-player .monster-item:nth-child(5) {
  grid-area: fp-5;
  align-self: center;
}

.vs-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  min-width: 60px;
  flex-shrink: 0;
}

.vs-text {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.monster-section-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.monster-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  grid-template-areas:
    "fp-0 fp-1 fp-3"
    "fp-0 fp-2 fp-4";
}

.monster-item {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  position: relative;
}

.monster-item img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-bottom: 0;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.monster-image-wrapper {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.monster-item.banned .monster-image-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: calc(100% - 2px);
  height: 2px;
  background: #f00;
  z-index: 10;
  border-radius: 1px;
  pointer-events: none;
}

.monster-item.banned .monster-image-wrapper::after {
  display: none;
}

.monster-item.banned img {
  opacity: 0.5;
}

.monster-item.leader img {
    border-color: #ff3636;
    border-width: 3px;
}

.monster-item:hover img {
  border-color: #667eea;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.monster-name {
  font-size: 11px;
  color: #fff;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #999;
  font-style: italic;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.no-data p {
  margin: 0;
  font-size: 14px;
}

.loading-card,
.error-card,
.empty-card {
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%) !important;
  color: #fff !important;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-message {
  color: #ff5252;
}

/* Responsive design */
@media (max-width: 768px) {
  .content {
    padding: 8px;
  }
  
  .header {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .header-left {
    order: 1;
    width: 100%;
    text-align: center;
  }

  .title {
    order: 2;
    width: 100%;
    text-align: center;
  }

  .player-names-header {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .player1-name, .player2-name {
    font-size: 14px;
  }

  .vs-text {
    font-size: 12px;
  }

  .match-header {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .match-player-left, .match-player-right {
    width: auto;
    justify-content: flex-start;
  }

  .match-player-right {
    justify-content: flex-end;
  }

  .match-center {
    width: auto;
    align-items: center;
  }

  .player-names {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .match-date {
    font-size: 11px;
  }

  .monster-battle-section {
    flex-direction: row;
    gap: 5px;
    align-items: center;
  }

  .vs-section {
    padding: 0 5px;
    min-width: 30px;
  }

  .vs-text {
    font-size: 14px;
  }

  .monster-grid {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    max-width: 200px;
    gap: 5px;
    grid-template-areas:
      "fp-0 fp-1 fp-3"
      "fp-0 fp-2 fp-4";
  }

  .first-pick-player .monster-grid {
    grid-template-areas:
      "fp-0 fp-1 fp-3"
      "fp-0 fp-2 fp-4";
  }

  .last-pick-player .monster-grid {
    grid-template-areas:
      "fp-1 fp-3 fp-5"
      "fp-2 fp-4 fp-5";
  }

  .monster-item {
    width: 50px;
    height: 50px;
  }

  .monster-item img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .monster-item:hover img {
    border-color: #667eea;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .player-score {
    font-size: 10px;
    padding: 1px 4px;
    min-width: 25px;
  }
}
</style> 
<style>

.pagination-container nav.v-pagination li {
  flex: 1;
}
</style>