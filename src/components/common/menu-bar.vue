<template>
  <!-- 좌측 네비게이션 메뉴 -->
  <v-navigation-drawer v-model="navigationDrawer">
    <!-- 메뉴 리스트 -->
    <v-list select-strategy="single-independent" style="padding: 0">
      <!-- 메뉴 아이템 반복 렌더링 -->
      <template v-for="item in menuStore.getActiveMenu" :key="item.menu_no">
        <!-- 하위 메뉴가 있는 경우 -->
        <v-list-group v-if="item.children && item.children.length > 0">
          <template #activator="{ props }">
            <!-- 상위 메뉴 아이템 -->
            <v-list-item
              v-bind="props"
              :title="item.title"
              :value="item.menu_no"
              class="left-menu-list-hover"
              :color="Constants.DC_BG_COLOR"
            />
          </template>
          <!-- 2단계 메뉴 아이템 반복 렌더링 -->
          <template v-for="childrenItem in item.children" :key="childrenItem.menu_no">
            <!-- 2단계 메뉴에 하위 메뉴가 있는 경우 -->
            <v-list-group
              v-if="childrenItem.children && childrenItem.children.length > 0"
            >
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :title="childrenItem.title"
                  :value="childrenItem.menu_no"
                  class="left-menu-list-hover"
                  :color="Constants.DC_BG_COLOR"
                />
              </template>
              <!-- 3단계 메뉴 아이템 반복 렌더링 -->
              <v-list-item
                v-for="grandChildItem in childrenItem.children"
                :key="grandChildItem.menu_no"
                class="cursor-pointer left-menu-list-hover"
                :title="grandChildItem.title"
                :value="grandChildItem.menu_no"
                :color="Constants.DC_BG_COLOR"
                @click="goMenu(grandChildItem)"
              />
            </v-list-group>
            <!-- 2단계 메뉴에 하위 메뉴가 없는 경우 -->
            <v-list-item
              v-else
              :title="childrenItem.title"
              :value="childrenItem.menu_no"
              class="cursor-pointer left-menu-list-hover"
              :color="Constants.DC_BG_COLOR"
              @click="goMenu(childrenItem)"
            />
          </template>
        </v-list-group>
        <!-- 하위 메뉴가 없는 경우 -->
        <v-list-item
          v-else
          :title="item.title"
          :value="item.menu_no"
          class="left-menu-list-hover"
          :color="Constants.DC_BG_COLOR"
          @click="goMenu(item)"
        />
      </template>
    </v-list>
    
    <!-- 서머너즈워 메뉴 -->
    <v-divider></v-divider>
    <v-list>
      <!-- 실레나 메뉴 -->
      <v-list-item
        prepend-icon="mdi-trophy"
        title="실레나"
        value="rta"
        class="left-menu-list-hover"
        :color="Constants.DC_BG_COLOR"
        @click="goToRta"
      />
      
      <!-- 점령전 메뉴 그룹 -->
      <v-list-group value="siege-group" :model-value="true">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-sword-cross"
            title="점령전"
            value="siege-group"
            class="left-menu-list-hover"
            :color="Constants.DC_BG_COLOR"
          />
        </template>
        
        <!-- 점령전 하위 메뉴들 -->
        <v-list-item
          title="전체 점령전"
          value="siege"
          class="left-menu-list-hover pl-8 sub-menu-item"
          :color="Constants.DC_BG_COLOR"
          @click="goToSiege"
        />
        <v-list-item
          title="최근 점령전"
          value="recent"
          class="left-menu-list-hover pl-8 sub-menu-item"
          :color="Constants.DC_BG_COLOR"
          @click="goToRecent"
        />
        <v-list-item
          title="시즌 성적표"
          value="record"
          class="left-menu-list-hover pl-8 sub-menu-item"
          :color="Constants.DC_BG_COLOR"
          @click="goToRecord"
        />
      </v-list-group>
    </v-list>
    
    <!-- 설정 메뉴 (하단 고정) -->
    <template #append>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          prepend-icon="mdi-cog"
          title="설정"
          value="settings"
          class="left-menu-list-hover"
          :color="Constants.DC_BG_COLOR"
          @click="goToSettings"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<script setup>
// 스토어, 유틸리티, 라우터 임포트
import { isMobile } from "~/utils/layout";

// 라우터 인스턴스 생성
const router = useRouter();

// 네비게이션 드로어 상태 변수
const navigationDrawer = leftMenuState;

// 메뉴 스토어 인스턴스 생성
const menuStore = useMenuStore();

// 모바일 화면 크기 변경 감지
watch(isMobile, (newValue) => {
  if (newValue) {
    // 모바일인 경우 메뉴 초기화
    menuStore.setActiveMenu("0");
  }
});

// 메뉴 클릭 시 해당 경로로 이동하는 함수
const goMenu = (item) => {
  router.push(item.path);
};

// 설정 페이지로 이동하는 함수
const goToSettings = () => {
  router.push('/settings');
};

// 서머너즈워 메뉴 네비게이션 함수들
const goToSiege = () => {
  router.push('/siege');
};

const goToRta = () => {
  router.push('/rta');
};

const goToRecord = () => {
  router.push('/record');
};

const goToRecent = () => {
  router.push('/recentSiege');
};

const goToSearch = () => {
  router.push('/search');
};
</script>

<style scoped>
/* 서브 메뉴 아이템 스타일 */
.sub-menu-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.sub-menu-item:hover {
  border-left-color: var(--v-primary-base);
  background-color: rgba(var(--v-primary-base), 0.1);
}

/* 메뉴 그룹 활성화 상태 개선 */
.v-list-group--open .v-list-group__header {
  background-color: rgba(var(--v-primary-base), 0.05);
  border-left: 3px solid var(--v-primary-base);
}

/* 메뉴 아이템 선택 상태 개선 */
.v-list-item--active {
  background-color: rgba(var(--v-primary-base), 0.15) !important;
  border-left: 3px solid var(--v-primary-base);
}

/* 호버 효과 개선 */
.left-menu-list-hover:hover {
  background-color: rgba(var(--v-primary-base), 0.08);
  transform: translateX(4px);
  transition: all 0.3s ease;
}

/* 서브 메뉴 호버 시 부드러운 전환 */
.sub-menu-item:hover {
  transform: translateX(8px);
}
</style>
