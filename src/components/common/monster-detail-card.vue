<template>
  <v-card variant="outlined" class="monster-detail-card">
    <v-card-title class="monster-title">
      {{ monster.name }}
    </v-card-title>
    
    <v-card-text>
      <!-- 룬 정보 -->
      <v-row class="rune-info">
        <v-col cols="6">
          <h6 class="info-label">룬 세트</h6>
          <p class="info-value">{{ monster.runeSet }}</p>
        </v-col>
        <v-col cols="6">
          <h6 class="info-label">룬 2번</h6>
          <p class="info-value">{{ monster.rune2 }}</p>
        </v-col>
      </v-row>
      
      <!-- 스탯 정보 -->
      <div class="stats-section">
        <h6 class="info-label">스탯</h6>
        <div class="stat-grid">
          <div 
            v-for="(stat, key) in statLabels" 
            :key="key"
            class="stat-item"
          >
            <span class="stat-name">{{ stat }}:</span>
            <span class="stat-base">{{ monster.stats[key].base }}</span>
            <span 
              v-if="monster.stats[key].plus" 
              class="stat-plus"
            >
              +{{ monster.stats[key].plus }}{{ key === 'cr' || key === 'cd' || key === 'res' || key === 'acc' ? '%' : '' }}
            </span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  monster: {
    type: Object,
    required: true
  },
  monsterIndex: {
    type: Number,
    required: true
  }
});

// 스탯 라벨 매핑
const statLabels = {
  hp: 'HP',
  atk: '공격력',
  def: '방어력',
  spd: '속도',
  cr: '치명타율',
  cd: '치명타피해',
  res: '저항',
  acc: '정확도'
};
</script>

<style scoped>
.monster-detail-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.monster-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 16px;
}

.rune-info {
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.info-value {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.stats-section {
  margin-top: 16px;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.stat-base {
  font-size: 13px;
  color: #666;
  margin-left: auto;
  margin-right: 12px;
}

.stat-plus {
  font-size: 13px;
  color: #4caf50;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}
</style>
