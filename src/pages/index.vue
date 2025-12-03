<template>
  <div class="min-h-screen pb-8 relative">
    <!-- 배경 이미지 -->
    <div 
      class="background-banner fixed inset-0"
      :class="{ 'bg-scroll': mobile, 'bg-fixed': !mobile }"
      :style="{ backgroundImage: `url(${mainBannerImage})` }"
      data-aos="fade-in"
    />
    
    <!-- 배경 오버레이 (가독성 향상) -->
    <div class="background-overlay fixed inset-0" />
    
    <!-- 컨텐츠 -->
    <div class="relative z-10">
      <v-container fluid class="pa-4 pa-md-8" style="max-width: 1400px;">
        <!-- 페이지 타이틀 -->
        <div class="text-center mb-6 mb-md-8" data-aos="fade-down">
          <h1 
            class="text-white font-bold mb-2"
            :style="{ 
              fontSize: mobile ? '24px' : '32px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }"
          >
            전투 로그 분석 시스템
          </h1>
          <p 
            class="text-[#b0b0b0]"
            :style="{ fontSize: mobile ? '13px' : '16px' }"
          >
            점령전과 실레나 전투 데이터를 분석하고 관리하세요
          </p>
        </div>

        <!-- 최근 점령전 카드 (최상단) -->
        <v-card
          class="mt-2 mt-md-4 recent-siege-card"
          elevation="0"
          data-aos="fade-up"
          data-aos-delay="300"
          @click="navigateTo('/recentSiege')"
          style="position: relative; z-index: 2;"
        >
          <v-card-text 
            class="d-flex align-center justify-space-between position-relative"
            :class="mobile ? 'pa-4' : 'pa-5'"
          >
            <div class="d-flex align-center z-index-2" style="flex: 1;">
              <div class="menu-icon-wrapper" :class="mobile ? 'mr-2' : 'mr-3'">
                <v-icon :size="mobile ? 24 : 28" color="#4a9eff">mdi-clock-outline</v-icon>
              </div>
              <div>
                <div class="d-flex align-center mb-1">
                  <p 
                    class="text-white font-bold mb-0" 
                    :class="mobile ? 'mr-2' : 'mr-3'"
                    :style="{ fontSize: mobile ? '16px' : '24px' }"
                  >
                    최근 점령전
                  </p>
                </div>
                <span class="new-badge new-badge-top">NEW</span>
                <p 
                  class="text-[#b0b0b0] mb-0"
                  :style="{ fontSize: mobile ? '11px' : '14px' }"
                >
                  최신 점령전 데이터를 확인하세요
                </p>
              </div>
            </div>
            <v-img 
              :src="section1Image"
              :width="mobile ? 70 : 120"
              class="recent-siege-image"
            />
          </v-card-text>
        </v-card>

        <!-- 메인 메뉴 그리드 (전체 점령전, 시즌 성적표) -->
        <div 
          class="d-flex flex-wrap mt-4 mt-md-6"
          :style="{ 
            gap: mobile ? '12px' : '20px'
          }"
        >

          <!-- 전체 점령전 -->
          <v-card
            class="menu-card flex-1"
            :style="{ 
              minWidth: mobile ? '100%' : '200px',
              flexBasis: mobile ? '100%' : 'calc(25% - 15px)',
              minHeight: mobile ? '120px' : '180px'
            }"
            data-aos="fade-up"
            data-aos-delay="300"
            elevation="0"
            @click="navigateTo('/siege')"
          >
            <v-card-text class="pa-5 h-100 d-flex flex-column justify-space-between position-relative">
              <div class="z-index-2">
                <div class="d-flex align-center mb-2">
                  <div class="menu-icon-wrapper mr-3">
                    <v-icon size="24" color="#4a9eff">mdi-sword-cross</v-icon>
                  </div>
                  <p 
                    class="text-white font-bold mb-0"
                    :style="{ fontSize: mobile ? '17px' : '20px' }"
                  >
                    전체 점령전
                  </p>
                </div>
                <p 
                  class="text-[#b0b0b0] mb-0"
                  :style="{ fontSize: mobile ? '13px' : '14px', lineHeight: '1.5' }"
                >
                  시즌별 공방덱 통계
                </p>
              </div>
              <v-img 
                :src="section4Image"
                class="menu-card-image-full"
              />
            </v-card-text>
          </v-card>

          <!-- 시즌 성적표 -->
          <v-card
            class="menu-card flex-1"
            :style="{ 
              minWidth: mobile ? '100%' : '200px',
              flexBasis: mobile ? '100%' : 'calc(25% - 15px)',
              minHeight: mobile ? '120px' : '180px'
            }"
            data-aos="fade-up"
            data-aos-delay="400"
            elevation="0"
            @click="navigateTo('/record')"
          >
            <v-card-text class="pa-5 h-100 d-flex flex-column justify-space-between position-relative">
              <div class="z-index-2">
                <div class="d-flex align-center mb-2">
                  <div class="menu-icon-wrapper mr-3">
                    <v-icon size="24" color="#4a9eff">mdi-chart-line</v-icon>
                  </div>
                  <p 
                    class="text-white font-bold mb-0"
                    :style="{ fontSize: mobile ? '17px' : '20px' }"
                  >
                    시즌 성적표
                  </p>
                </div>
                <p 
                  class="text-[#b0b0b0] mb-0"
                  :style="{ fontSize: mobile ? '13px' : '14px', lineHeight: '1.5' }"
                >
                  시즌별 공성률 통계
                </p>
              </div>
              <v-img 
                :src="section5Image"
                :width="mobile ? '110px' : '160px'"
                class="menu-card-image"
              />
            </v-card-text>
          </v-card>
        </div>

      </v-container>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify';

// 이미지 import
import section1Image from '~/assets/images/main/section1.png';
import section2Image from '~/assets/images/main/section2.png';
import section3Image from '~/assets/images/main/section3.png';
import section4Image from '~/assets/images/main/section4.png';
import section5Image from '~/assets/images/main/section5.png';
import mainBannerImage from '~/assets/images/main/main_banner1.jpg';

// 페이지 메타 설정
definePageMeta({
  layout: 'default'
});

// 반응형 breakpoint 확인
const { mobile } = useDisplay();
</script>

<style scoped>
.background-banner {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.background-overlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

.bg-scroll {
  background-attachment: scroll;
}

.bg-fixed {
  background-attachment: fixed;
}

/* 메뉴 카드 스타일 */
.menu-card {
  background: linear-gradient(135deg, rgba(39, 40, 46, 0.95) 0%, rgba(47, 48, 55, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.menu-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(74, 158, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.menu-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(74, 158, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(74, 158, 255, 0.3);
}

.menu-card:hover::before {
  opacity: 1;
}

.menu-card:active {
  transform: translateY(-4px) scale(0.99);
}

.menu-card.full-width {
  width: 100%;
}

.menu-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(74, 158, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.menu-card:hover .menu-icon-wrapper {
  background: rgba(74, 158, 255, 0.25);
  transform: scale(1.1);
}

.menu-card-image {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.6;
  transition: all 0.3s ease;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.menu-card-image-full {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  opacity: 0.5;
  transition: all 0.3s ease;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.menu-card:hover .menu-card-image,
.menu-card:hover .menu-card-image-full {
  opacity: 0.8;
  transform: scale(1.1) translateY(-5px);
}

.z-index-2 {
  position: relative;
  z-index: 2;
}

/* 최근 점령전 카드 */
.recent-siege-card {
  background: linear-gradient(135deg, rgba(39, 40, 46, 0.98) 0%, rgba(47, 48, 55, 0.98) 100%) !important;
  border: 1px solid rgba(74, 158, 255, 0.3) !important;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.recent-siege-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.15) 0%, rgba(74, 158, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.recent-siege-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(74, 158, 255, 0.25), 0 6px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(74, 158, 255, 0.4);
}

.recent-siege-card:hover::before {
  opacity: 1;
}

.recent-siege-card:active {
  transform: translateY(-3px);
}

.recent-siege-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  transition: all 0.3s ease;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
}

.recent-siege-card:hover .recent-siege-image {
  opacity: 0.8;
  transform: translateY(-50%) scale(1.1);
}

.new-badge {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #1cce1c 0%, #16a816 100%);
  color: white;
  font-size: 11px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(28, 206, 28, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.new-badge-top {
  position: absolute;
  top: 12px;
  right: 16px;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(28, 206, 28, 0.4);
  }
  50% {
    box-shadow: 0 2px 16px rgba(28, 206, 28, 0.7);
  }
}

/* 모바일 최적화 */
@media (max-width: 960px) {
  .menu-card {
    min-height: 120px !important;
  }
  
  .menu-card-image,
  .menu-card-image-full {
    opacity: 0.5;
  }
  
  .recent-siege-card {
    margin-top: 24px !important;
  }
  
  .recent-siege-image {
    opacity: 0.5;
    right: 10px !important;
  }
  
  .menu-icon-wrapper {
    width: 36px;
    height: 36px;
  }
}
</style>
