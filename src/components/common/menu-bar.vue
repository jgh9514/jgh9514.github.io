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
</script>
