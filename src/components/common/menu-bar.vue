<template>
  <!-- 좌측 네비게이션 메뉴 -->
  <v-navigation-drawer
    v-model="navigationDrawer"
    :temporary="isMobile"
    :permanent="!isMobile"
    width="256"
    location="left"
    style="position: fixed; left: 0; top: 64px; height: calc(100vh - 64px);"
  >
    <v-list>
      <!-- 메뉴 아이템 반복 렌더링 -->
      <template v-for="item in menuStore.getActiveMenu" :key="item.menu_no">
        <!-- 하위 메뉴가 있는 경우 -->
        <v-list-group v-if="item.children && item.children.length > 0" :value="String(item.menu_no)">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="item.title" />
          </template>
          <!-- 2단계 메뉴 아이템 반복 렌더링 -->
          <template v-for="childrenItem in item.children" :key="childrenItem.menu_no">
            <!-- 2단계 메뉴에 하위 메뉴가 있는 경우 -->
            <v-list-group
              v-if="childrenItem.children && childrenItem.children.length > 0"
              :value="String(childrenItem.menu_no)"
              sub-group
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :title="childrenItem.title" />
              </template>
              <!-- 3단계 메뉴 아이템 반복 렌더링 -->
              <v-list-item
                v-for="grandChildItem in childrenItem.children"
                :key="grandChildItem.menu_no"
                :value="String(grandChildItem.menu_no)"
                :title="grandChildItem.title"
                @click="goMenu(grandChildItem)"
              />
            </v-list-group>
            <!-- 2단계 메뉴에 하위 메뉴가 없는 경우 -->
            <v-list-item
              v-else
              :value="String(childrenItem.menu_no)"
              :title="childrenItem.title"
              @click="goMenu(childrenItem)"
            />
          </template>
        </v-list-group>
        <!-- 하위 메뉴가 없는 경우 -->
        <v-list-item
          v-else
          :value="String(item.menu_no)"
          :title="item.title"
          @click="goMenu(item)"
        />
      </template>
    </v-list>
    
    <!-- 추가 메뉴들 -->
    <v-divider />
    <v-list>
      <!-- 동적 메뉴 렌더링 (권한에 따라 필터링됨) -->
      <template v-for="menu in additionalMenus" :key="menu.value">
        <!-- 하위 메뉴가 있는 경우 -->
        <v-list-group v-if="menu.children && menu.children.length > 0" :value="menu.value">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon v-if="menu.icon" class="me-2">{{ getIcon(menu.icon) }}</v-icon>
              <span>{{ menu.title }}</span>
            </v-list-item>
          </template>
          
          <!-- 하위 메뉴 아이템들 -->
          <v-list-item
            v-for="child in menu.children"
            :key="child.value"
            :value="child.value"
            :title="child.title"
            @click="navigateTo(child.path)"
          />
        </v-list-group>
        
        <!-- 하위 메뉴가 없는 경우 -->
        <v-list-item
          v-else
          :value="menu.value"
          @click="navigateTo(menu.path)"
        >
          <template v-slot:prepend>
            <v-icon v-if="menu.icon" class="me-2">{{ getIcon(menu.icon) }}</v-icon>
          </template>
          <v-list-item-title>{{ menu.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    
    <!-- 설정 메뉴 (하단 고정) -->
    <v-divider />
    <v-list>
      <v-list-item value="settings" @click="goToSettings">
        <template v-slot:prepend>
          <v-icon class="me-2">mdi-cog</v-icon>
        </template>
        <v-list-item-title>설정</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
// 스토어, 유틸리티, 라우터 임포트
import { isMobile as isMobileLayout } from "~/utils/layout";

// 라우터 인스턴스 생성
const router = useRouter();
const route = useRoute();

// 모바일 여부 확인
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 960 || isMobileLayout.value;
  }
  return isMobileLayout.value;
});

// 네비게이션 드로어 상태 변수
const navigationDrawer = leftMenuState;

// 메뉴 스토어 인스턴스 생성
const menuStore = useMenuStore();
const userStore = useUserStore();

// 활성 메뉴
const activeMenu = computed(() => {
  return String(route.meta?.menuNo || '0');
});

// 아이콘 매핑 함수
const getIcon = (iconName) => {
  const iconMap = {
    'Trophy': 'mdi-trophy',
    'Sword': 'mdi-sword',
    'Setting': 'mdi-cog'
  };
  return iconMap[iconName] || 'mdi-circle';
};

// 사용자가 관리자인지 확인
const isAdmin = computed(() => {
  const user = userStore.getUserState;
  const roles = user?.roles || (user?.role_id ? [user.role_id] : []);
  console.log(roles);
  return roles.some(role => (typeof role === 'string' ? role : role.role_id) === 'RL0001');
});

// 전체 메뉴 정의
const allAdditionalMenus = [
  {
    title: '실레나',
    value: 'rta',
    icon: 'Trophy',
    path: '/rta'
  },
  {
    title: '점령전',
    value: 'siege-group',
    icon: 'Sword',
    children: [
      {
        title: '전체 점령전',
        value: 'siege',
        path: '/siege'
      },
      {
        title: '최근 점령전',
        value: 'recent',
        path: '/recentSiege'
      },
      {
        title: '시즌 성적표',
        value: 'record',
        path: '/record'
      }
    ]
  },
  {
    title: '시스템 관리',
    value: 'system-group',
    icon: 'Setting',
    adminOnly: true,  // 관리자 전용 플래그
    children: [
      {
        title: '코드 관리',
        value: 'cdmn',
        path: '/preference/cdmn'
      },
      {
        title: '코드 관계',
        value: 'cdrelmn',
        path: '/preference/cdrelmn'
      },
      {
        title: '사용자 목록',
        value: 'userlist',
        path: '/preference/userlist'
      },
      {
        title: '권한 관리',
        value: 'rolemn',
        path: '/preference/rolemn'
      },
      {
        title: '권한별 사용자',
        value: 'roleuserlist',
        path: '/preference/mrgd/roleuserlist'
      },
      {
        title: '메뉴 관리',
        value: 'menumn',
        path: '/preference/menumn'
      },
      {
        title: '권한별 메뉴',
        value: 'rolemenumn',
        path: '/preference/rolemenumn'
      },
      {
        title: '화면 관리',
        value: 'pagemn',
        path: '/preference/pagemn'
      },
      {
        title: 'API 관리',
        value: 'apimn',
        path: '/preference/apimn'
      },
      {
        title: '권한별 API',
        value: 'roleapimn',
        path: '/preference/roleapimn'
      },
      {
        title: '다국어 관리',
        value: 'mlangmn',
        path: '/preference/mlangmn'
      },
      {
        title: '로그인 이력',
        value: 'loginhislist',
        path: '/preference/loginhislist'
      },
      {
        title: 'API 이력',
        value: 'apihislist',
        path: '/preference/apihislist'
      }
    ]
  }
];

// 권한에 따라 필터링된 추가 메뉴
const additionalMenus = computed(() => {
  return allAdditionalMenus.filter(menu => {
    // adminOnly가 true인 메뉴는 관리자만 볼 수 있음
    if (menu.adminOnly) {
      return isAdmin.value;
    }
    return true;
  });
});

// 모바일 화면 크기 변경 감지
watch(() => isMobile.value, (newValue) => {
  if (newValue) {
    // 모바일인 경우 메뉴 초기화
    menuStore.setActiveMenu("0");
  }
});

// 메뉴 클릭 시 해당 경로로 이동하는 함수
const goMenu = (item) => {
  router.push(item.path);
  if (isMobile.value) {
    navigationDrawer.value = false;
  }
};

// 공통 네비게이션 함수
const navigateTo = (path) => {
  router.push(path);
  if (isMobile.value) {
    navigationDrawer.value = false;
  }
};

// 설정 페이지로 이동하는 함수
const goToSettings = () => {
  router.push('/settings');
  if (isMobile.value) {
    navigationDrawer.value = false;
  }
};
</script>

<style scoped>
</style>
