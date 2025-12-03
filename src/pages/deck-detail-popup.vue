<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card rounded="lg">
      <v-card-title
        class="d-flex justify-space-between align-center text-white pa-5"
        :style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }"
      >
        <span class="text-h6 font-weight-semibold">추천 공덱 상세정보</span>
        <v-btn
          icon
          variant="text"
          @click="close"
          class="text-white"
          size="small"
          :style="{ position: 'absolute', top: '12px', right: '12px', minWidth: '32px', width: '32px', height: '32px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }"
        >
          <v-icon size="22">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="pa-6" style="max-height: 70vh; overflow-y: auto;">
        <!-- 로딩 상태 -->
        <div v-if="loading" class="d-flex flex-column align-center justify-center" style="padding: 60px 0;">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mt-4 text-grey">데이터를 불러오는 중...</p>
        </div>
        
        <!-- 에러 상태 -->
        <div v-else-if="error" class="d-flex flex-column align-center justify-center text-center" style="padding: 60px 20px;">
          <v-icon color="error" size="64">mdi-alert-circle</v-icon>
          <p class="mt-4 text-error text-body-1 font-weight-medium">{{ error }}</p>
          <v-btn color="primary" @click="retry" class="mt-6">
            다시 시도
          </v-btn>
        </div>
        
        <!-- 데이터 로드 완료 -->
        <div v-else-if="detailData && hasValidData">
          <!-- 공덱 구성 이미지 -->
          <div class="mb-6">
            <div class="d-flex align-center justify-center" style="gap: 8px;">
              <div
                v-for="(imageUrl, index) in monsterImageUrls"
                :key="index"
                class="d-flex align-center justify-center"
                :style="{
                  position: 'relative',
                  transform: index === selectedMonsterIndex ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s'
                }"
                @click="selectMonster(index)"
              >
                <template v-if="imageUrl">
                  <img
                    v-if="!imageLoadErrors.has(imageUrl)"
                    :src="imageUrl"
                    :alt="`몬스터 ${index + 1}`"
                    :style="{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      border: index === selectedMonsterIndex ? '2px solid #ffd54f' : '2px solid #d79f34',
                      boxShadow: index === selectedMonsterIndex ? '0 0 0 2px rgba(255, 213, 79, 0.6)' : 'none',
                      objectFit: 'cover'
                    }"
                    @error="handleImageError($event, imageUrl)"
                    @load="handleImageLoad(imageUrl)"
                  />
                  <div
                    v-else
                    class="d-flex flex-column align-center justify-center text-grey"
                    :style="{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      border: '2px dashed #d79f34',
                      backgroundColor: '#f5f5f5',
                      fontSize: '12px',
                      gap: '4px'
                    }"
                  >
                    <v-icon size="24">mdi-image-off</v-icon>
                    <span>이미지 없음</span>
                  </div>
                </template>
                <div
                  v-else
                  class="d-flex flex-column align-center justify-center text-grey"
                  :style="{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    border: '2px dashed #d79f34',
                    backgroundColor: '#f5f5f5',
                    fontSize: '12px',
                    gap: '4px'
                  }"
                >
                  <v-icon size="24">mdi-image-off</v-icon>
                  <span>이미지 없음</span>
                </div>
                <v-chip
                  v-if="index === selectedMonsterIndex"
                  size="x-small"
                  class="text-amber-lighten-3"
                  :style="{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    whiteSpace: 'nowrap'
                  }"
                >
                  선택됨
                </v-chip>
              </div>
            </div>
          </div>
          
          <!-- 선택된 몬스터 상세 정보 (스탯 슬라이드) -->
          <div
            v-if="selectedMonster"
            style="touch-action: pan-y;"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <MonsterDetailCard
              :monster="selectedMonster"
              :monster-index="selectedMonsterIndex + 1"
            />
          </div>
          <div v-else class="d-flex flex-column align-center justify-center text-center" style="padding: 60px 20px;">
            <v-icon color="grey" size="48">mdi-information-outline</v-icon>
            <p class="mt-4 text-grey">몬스터 정보가 없습니다.</p>
          </div>
        </div>
        
        <!-- 데이터 없음 -->
        <div v-else class="d-flex flex-column align-center justify-center text-center" style="padding: 60px 20px;">
          <v-icon color="grey" size="48">mdi-information-outline</v-icon>
          <p class="mt-4 text-grey">표시할 데이터가 없습니다.</p>
        </div>
      </v-card-text>
      
      <v-card-actions class="pa-4" style="border-top: 1px solid #e9ecef;">
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="outlined"
          class="mr-2"
          @click="onDeleteClick"
        >
          삭제
        </v-btn>
        <v-btn color="primary" @click="close">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import MonsterDetailCard from "~/components/common/monster-detail-card.vue";

const emit = defineEmits(["deleted"]);

const isOpen = ref(false);
const loading = ref(false);
const detailData = ref(null);
const error = ref(null);
const lastSelectedItem = ref(null);
const imageLoadErrors = ref(new Set());
const selectedMonsterIndex = ref(0);
const touchStartX = ref(null);

// 몬스터 이미지 URL 배열
const monsterImageUrls = computed(() => {
  if (!detailData.value) return [];
  
  const urls = [];
  for (let i = 1; i <= 3; i++) {
    const imageUrl = detailData.value[`image_url${i}`];
    if (imageUrl) {
      urls.push(`${Constants.BASE_URL}${imageUrl}`);
    } else {
      urls.push(null);
    }
  }
  return urls;
});

// 유효한 데이터가 있는지 확인
const hasValidData = computed(() => {
  if (!detailData.value) return false;
  
  // 최소한 하나의 몬스터 정보라도 있어야 함
  return monsterDetails.value.length > 0 || 
         monsterImageUrls.value.some(url => url !== null);
});

// 스탯 값 정규화 함수
const normalizeStatValue = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

// 몬스터 상세 정보 추출 및 정규화
const monsterDetails = computed(() => {
  if (!detailData.value) return [];
  
  const monsters = [];
  
  for (let i = 1; i <= 3; i++) {
    const name = detailData.value[`m${i}_kr_name`];
    
    // 이름이 없으면 스킵
    if (!name || name.trim() === '') {
      continue;
    }
    
    // 룬 정보 추출
    const runeSet = detailData.value[`m${i}_rune_set`] || 
                    detailData.value.rune_set || 
                    '정보 없음';
    const rune2 = detailData.value[`m${i}_rune_2`] || 
                  detailData.value.rune_2 || 
                  '정보 없음';
    
    // 스탯 정보 추출 및 정규화
    const getStat = (statName) => {
      const base = normalizeStatValue(
        detailData.value[`m${i}_${statName}_base`] || 
        detailData.value[`${statName}_base`]
      );
      const plus = normalizeStatValue(
        detailData.value[`m${i}_${statName}_plus`] || 
        detailData.value[`${statName}_plus`],
        null
      );
      return { base, plus: plus !== null ? plus : undefined };
    };
    
    const monster = {
      name: name.trim(),
      runeSet: runeSet.trim(),
      rune2: rune2.trim(),
      stats: {
        hp: getStat('hp'),
        atk: getStat('atk'),
        def: getStat('def'),
        spd: getStat('spd'),
        cr: getStat('cr'),
        cd: getStat('cd'),
        res: getStat('res'),
        acc: getStat('acc'),
      }
    };
    
    monsters.push(monster);
  }
  
  return monsters;
});

// 선택된 몬스터
const selectedMonster = computed(() => {
  if (!monsterDetails.value.length) return null;
  const index = Math.min(
    Math.max(selectedMonsterIndex.value, 0),
    monsterDetails.value.length - 1
  );
  return monsterDetails.value[index] || null;
});

// 몬스터 선택
const selectMonster = (index) => {
  if (index < 0 || index >= monsterImageUrls.value.length) return;
  selectedMonsterIndex.value = index;
};

// 터치 슬라이드 시작
const onTouchStart = (event) => {
  if (!event.touches || !event.touches.length) return;
  touchStartX.value = event.touches[0].clientX;
};

// 터치 슬라이드 종료
const onTouchEnd = (event) => {
  if (touchStartX.value === null) return;

  const endX = event.changedTouches?.[0]?.clientX;
  if (endX === undefined) {
    touchStartX.value = null;
    return;
  }

  const diffX = endX - touchStartX.value;
  const threshold = 30; // 최소 스와이프 거리

  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // 왼쪽으로 스와이프 → 다음 몬스터
      selectMonster(Math.min(selectedMonsterIndex.value + 1, monsterImageUrls.value.length - 1));
    } else {
      // 오른쪽으로 스와이프 → 이전 몬스터
      selectMonster(Math.max(selectedMonsterIndex.value - 1, 0));
    }
  }

  touchStartX.value = null;
};

// 공덱 삭제
const onDeleteClick = async () => {
  const target = lastSelectedItem.value || detailData.value;

  if (!target) {
    $toast("삭제할 공덱 정보가 없습니다.", "error");
    return;
  }

  if (!confirm("이 공덱을 삭제하시겠습니까?")) {
    return;
  }

  try {
    const params = validateParams(target);
    const result = await $api.post("/summonerswar/deck-detail-delete", params);

    if (result === "SUCCESS" || result?.result === "SUCCESS") {
      $toast("공덱이 삭제되었습니다.", "success");
      emit("deleted", params.deck_id);
      close();
    } else {
      throw new Error("삭제에 실패했습니다.");
    }
  } catch (err) {
    console.error("공덱 삭제 실패:", err);
    $toast("공덱 삭제 중 오류가 발생했습니다.", "error");
  }
};

// API 파라미터 검증
const validateParams = (item) => {
  // deck_id를 우선적으로 사용, 없으면 id 사용
  const deckId = item.deck_id || item.id || item.team_id;
  
  if (!deckId) {
    throw new Error('덱 ID가 필요합니다.');
  }
  
  return {
    // 삭제는 deck_id 기준으로만 수행 (DB PK 기반)
    deck_id: deckId,
  };
};

// API 응답 데이터 검증
const validateResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('유효하지 않은 응답 데이터입니다.');
  }
  
  // 최소한 하나의 몬스터 정보나 이미지가 있어야 함
  const hasMonsterData = Array.from({ length: 3 }, (_, i) => i + 1).some(i => {
    return response[`m${i}_kr_name`] || response[`image_url${i}`];
  });
  
  if (!hasMonsterData) {
    console.warn('응답 데이터에 몬스터 정보가 없습니다:', response);
  }
  
  return response;
};

// 이미지 로드 에러 처리
const handleImageError = (event, imageUrl) => {
  if (imageUrl) {
    imageLoadErrors.value.add(imageUrl);
  }
  if (event?.target) {
    event.target.style.display = 'none';
  }
};

// 이미지 로드 성공 처리
const handleImageLoad = (imageUrl) => {
  if (imageUrl) {
    imageLoadErrors.value.delete(imageUrl);
  }
};

// 상세 데이터 조회
const fetchDetailData = async (item) => {
  if (!item) {
    error.value = '선택된 항목이 없습니다.';
    return;
  }
  
  loading.value = true;
  error.value = null;
  imageLoadErrors.value.clear();
  
  try {
    // 파라미터 검증
    const params = validateParams(item);
    
    // API 호출 - 공덱 상세 정보 조회
    const response = await $api.post('/summonerswar/deck-detail', params);
    
    // 응답 데이터 검증
    const validatedData = validateResponse(response);
    detailData.value = validatedData;
    
    // 성공 메시지 (선택사항)
    if (process.env.NODE_ENV === 'development') {
      console.log('공덱 상세 정보 조회 성공:', validatedData);
    }
    
  } catch (err) {
    console.error('공덱 상세 정보 조회 실패:', err);
    
    // 에러 메시지 설정
    let errorMessage = '데이터를 불러오는데 실패했습니다.';
    
    if (err instanceof Error) {
      errorMessage = err.message || errorMessage;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    error.value = errorMessage;
    
    // 사용자에게 알림
    $toast(errorMessage, 'error');
    
    // 실패 시 기존 아이템 데이터를 fallback으로 사용 (선택사항)
    if (item && Object.keys(item).length > 0) {
      console.warn('기존 아이템 데이터를 fallback으로 사용합니다.');
      detailData.value = item;
    } else {
      detailData.value = null;
    }
  } finally {
    loading.value = false;
  }
};

// 재시도 함수
const retry = async () => {
  if (lastSelectedItem.value) {
    await fetchDetailData(lastSelectedItem.value);
  }
};

// 팝업 열기
const open = async (selectedItem) => {
  if (!selectedItem) {
    $toast('선택된 항목이 없습니다.', 'error');
    return;
  }
  
  isOpen.value = true;
  detailData.value = null;
  error.value = null;
  lastSelectedItem.value = selectedItem;
  imageLoadErrors.value.clear();
  selectedMonsterIndex.value = 0;
  
  await fetchDetailData(selectedItem);
};

// 팝업 닫기
const close = () => {
  isOpen.value = false;
  detailData.value = null;
  error.value = null;
  loading.value = false;
  lastSelectedItem.value = null;
  imageLoadErrors.value.clear();
  selectedMonsterIndex.value = 0;
};

defineExpose({
  open,
  close,
});
</script>
