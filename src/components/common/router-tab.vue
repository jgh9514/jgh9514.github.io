<template>
  <div class="router_view">
    <!-- 팝업 메뉴 컴포넌트 -->
    <transition name="popup-slide">
      <div v-if="isPopupVisible" class="popup" :style="popupPosition">
        <ul>
          <!-- 탭 새로고침 메뉴 -->
          <li class="active" @click="tabRefresh($event, 'refresh')">Refresh</li>
          <li class="active" @click="tabRefresh($event, 'all')">Refresh All</li>
          <!-- 탭 닫기 관련 메뉴 -->
          <li :class="{ active: tabs.length > 1 }" @click="tabClose($event, 'close')">Close</li>
          <li :class="{ active: focusTabIndex != 0 }" @click="tabClose($event, 'left')">Close to the Left</li>
          <li :class="{ active: focusTabIndex != tabs.length - 1 }" @click="tabClose($event, 'right')">Close to the Right</li>
          <li :class="{ active: tabs.length > 1 }" @click="tabClose($event, 'others')">Close Others</li>
        </ul>
      </div>
    </transition>
    <!-- 탭 컨테이너 -->
    <div class="tabs-container">
      <ul class="tabs-list">
        <!-- 각 탭 아이템 -->
        <li v-for="(tab, index) in tabs" :key="tab.name" class="draggable" :class="{ active: tab.isActive }" @contextmenu.prevent="showPopup($event, index)">
          <span @click="ChangeTab(tab)">{{ tab.name }}</span>
          <!-- 탭 닫기 버튼 -->
          <div v-if="tabs.length > 1" class="close-container" @click="closeTab(tab)">
            <span class="btn_pop_cls" />
          </div>
        </li>
      </ul>
    </div>
    <div class="content-container">
      <!-- 페이지 헤더 -->
      <div class="page-header-container" v-if="pageStore.getActivePage.routeName !== 'index'">
        <div class="page-header-title">{{ pageStore.getActivePage.page_nm }}</div>
        <div class="page-header-path-navigator">
          <v-breadcrumbs class="page-header-path-navigator" :items="navigationItems" density="compact">
            <template #divider>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-breadcrumbs>
        </div>
      </div>
      <!-- 라우터 뷰 컨테이너 -->
      <div class="router-tab__container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="activeComponentKey" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script setup>
// 라우터 인스턴스 초기화
const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const pageStore = usePageStore()
const routeStore = useRouteStore()
const routeParam = useRouteParam()
const searchConditionStore = useSearchConditionStore()

// 상태 관리를 위한 반응형 변수들
const tabs = reactive([]) // 탭 목록
const cachedViews = ref([]) // 캐시된 뷰 목록
const activeTabIndex = ref(-1) // 현재 활성화된 탭 인덱스
const componentKey = ref(0) // 컴포넌트 키 생성을 위한 카운터
const activeComponentKey = ref(0) // 현재 활성화된 컴포넌트 키
const isPopupVisible = ref(false) // 팝업 메뉴 표시 여부
const popupPosition = ref({
  // 팝업 메뉴 위치
  top: '0px',
  left: '0px',
})
const focusTabIndex = ref(0) // 현재 포커스된 탭 인덱스
const isUpdating = ref(false) // 탭 업데이트 중복 방지 플래그

// 페이지 헤더 관련 변수들
const menus = computed(() => menuStore.getMenuState)
const navigationItems = ref([]) // 기본값 설정
const currentTabTitle = computed(() => {
  if (tabs.length === 0) return ''
  return tabs[activeTabIndex.value]?.name || ''
})

/**
 * 선택된 탭 업데이트 함수
 * 새로운 탭 추가 또는 기존 탭 업데이트 처리
 */
const updateSelectedTab = async (name, path) => {
  // 중복 업데이트 방지
  if (isUpdating.value) {
    return
  }
  
  try {
    isUpdating.value = true
    
    // pageStore가 준비되지 않은 경우 대기
    if (!pageStore.getActivePage || !pageStore.getActivePage.menu_nm) {
      await nextTick()
      return
    }

    const newTab = [
      {
        name: pageStore.getActivePage.menu_nm,
        path: path,
        fullPath: pageStore.getActivePage.path,
        pageId: pageStore.getActivePage.page_id,
        routeName: pageStore.getActivePage.routeName?.split('-').pop() || name,
        isActive: true,
        key: componentKey.value++,
      },
    ]
    
    const uniqueTabs = newTab.filter((tab) => !tabs.some((t) => t.path === tab.path))
    const fullPathCheck = newTab.filter((tab) => tabs.some((t) => t.fullPath === tab.fullPath && t.path !== tab.path))

    // 모든 탭 비활성화
    tabs.forEach((e) => {
      e.isActive = false
    })
    
    let newPath = ''
    if (tabs.length > 0 && fullPathCheck.length > 0) {
      // 기존 탭 업데이트 (경로 변경)
      const index = tabs.findIndex((t) => t.fullPath === fullPathCheck[0].fullPath)
      if (index !== -1) {
        tabs[index].name = fullPathCheck[0].name
        tabs[index].path = fullPathCheck[0].path
        tabs[index].isActive = true
        activeTabIndex.value = index
        const cacheIndex = cachedViews.value.indexOf(tabs[index].routeName)
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1)
        }
        cachedViews.value.push(fullPathCheck[0].routeName)
        tabs[index].routeName = fullPathCheck[0].routeName
        tabs[index].key = componentKey.value++
        activeComponentKey.value = tabs[index].key
        newPath = fullPathCheck[0].path
      }
    } else if (uniqueTabs.length > 0) {
      // 새로운 탭 추가
      tabs.push(...uniqueTabs)
      activeTabIndex.value = tabs.length - 1
      cachedViews.value.push(uniqueTabs[0].routeName)
      newPath = uniqueTabs[0].path
      activeComponentKey.value = uniqueTabs[0].key
    } else {
      // 기존 탭 활성화
      const index = tabs.findIndex((t) => t.path === newTab[0].path)
      if (index !== -1) {
        tabs[index].isActive = true
        activeTabIndex.value = index
        newPath = newTab[0].path
        activeComponentKey.value = tabs[index].key
      }
    }
    
    // 탭이 업데이트될 때 네비게이션 아이템 업데이트
    if (newPath) {
      findMenuPath(menus.value, newPath)
    }
  } catch (error) {
    // 에러가 발생해도 애플리케이션 동작에 영향을 주지 않도록 조용히 처리
  } finally {
    isUpdating.value = false
  }
}

/**
 * 탭 변경 함수
 * @param {Object} tab - 변경할 탭 객체
 */
const ChangeTab = async (tab) => {
  try {
    if (!tab || !tab.path) {
      return
    }
    await $gfn_go(tab.path)
  } catch (error) {
    // 에러가 발생해도 애플리케이션 동작에 영향을 주지 않도록 조용히 처리
  }
}

/**
 * 탭 닫기 함수
 * @param {Object} tab - 닫을 탭 객체
 */
const closeTab = (tab) => {
  const index = tabs.findIndex((t) => t.path === tab.path)
  if (index !== -1) {
    // 탭이 활성화 상태였는지 확인
    const wasActive = tab.isActive

    // 캐시에서 제거
    const cacheIndex = cachedViews.value.indexOf(tab.routeName)
    if (cacheIndex > -1) {
      cachedViews.value.splice(cacheIndex, 1)
    }

    // 탭 제거
    tabs.splice(index, 1)

    // 탭이 없으면 종료
    if (tabs.length === 0) return

    // 닫은 탭이 활성화 상태였을 경우에만 다음 탭 활성화
    if (wasActive) {
      // 마지막 탭이었으면 이전 탭으로, 아니면 같은 위치의 탭으로 이동
      const nextIndex = index >= tabs.length ? tabs.length - 1 : index
      ChangeTab(tabs[nextIndex])
    } else {
      // 닫은 탭이 활성화된 탭보다 앞에 있었다면 activeTabIndex 조정
      if (index < activeTabIndex.value) {
        activeTabIndex.value--
      }
    }

    // 닫는 탭 화면의 라우터 파라미터 초기화
    if (!$gfn_isEmpty(routeParam.value)) {
      routeParam.value[tab.path] = null
    }
    // 닫는 탭 화면의 검색조건 초기화
    searchConditionStore.setSchCondition(tab.pageId, {})
  }
}

/**
 * 팝업 메뉴 표시 함수
 * @param {Event} event - 컨텍스트 메뉴 이벤트
 * @param {Number} index - 탭 인덱스
 */
const showPopup = (event, index) => {
  event.preventDefault()
  event.stopPropagation() // 이벤트 전파 중지
  isPopupVisible.value = true

  popupPosition.value = {
    top: event.clientY + 'px',
    left: event.clientX + 'px',
  }

  focusTabIndex.value = index
}

/**
 * 팝업 메뉴 닫기 함수
 */
const closePopup = () => {
  isPopupVisible.value = false
}

/**
 * 탭 새로고침 함수
 * @param {Event} event - 클릭 이벤트
 * @param {String} type - 새로고침 타입 ('refresh' 또는 'all')
 */
const tabRefresh = (event, type) => {
  if ($gfn_isEmpty(event.target.className) && event.target.className.length < 0) {
    return
  }
  if (type === 'refresh') {
    tabs[focusTabIndex.value].key = componentKey.value++
    if (activeTabIndex.value == focusTabIndex.value) {
      activeComponentKey.value = tabs[focusTabIndex.value].key
    }
    const cacheIndex = cachedViews.value.indexOf(tabs[activeTabIndex.value].routeName)
    if (cacheIndex > -1) {
      cachedViews.value.splice(cacheIndex, 1)
      nextTick(() => {
        cachedViews.value.push(tabs[activeTabIndex.value].routeName)
      })
    }
  } else if (type === 'all') {
    tabs.forEach((e) => {
      e.key = componentKey.value++
    })
    if (activeTabIndex.value == focusTabIndex.value) {
      activeComponentKey.value = tabs[focusTabIndex.value].key
    }
    // 모든 탭의 캐시를 제거하고 리로드
    const tempPaths = [...tabs.map((tab) => tab.routeName)]
    cachedViews.value = []
    nextTick(() => {
      cachedViews.value = tempPaths
    })
  }
}

/**
 * 탭 닫기 관련 함수
 * @param {Event} event - 클릭 이벤트
 * @param {String} type - 닫기 타입 ('close', 'left', 'right', 'others')
 */
const tabClose = (event, type) => {
  if (($gfn_isEmpty(event.target.className) && event.target.className.length < 0) || event.target.className.indexOf('active') === -1) {
    return
  }
  if (type === 'close') {
    closeTab(tabs[focusTabIndex.value])
  } else if (type === 'left') {
    // 왼쪽 탭들 닫기
    const removedPaths = tabs.slice(0, focusTabIndex.value).map((tab) => tab.path)
    cachedViews.value = cachedViews.value.filter((path) => !removedPaths.includes(path))
    tabs.splice(0, focusTabIndex.value)
    if (activeTabIndex.value <= focusTabIndex.value) {
      const nextTab = tabs[0]
      ChangeTab(nextTab)
    }
  } else if (type === 'right') {
    // 오른쪽 탭들 닫기
    const removedPaths = tabs.slice(focusTabIndex.value + 1).map((tab) => tab.path)
    cachedViews.value = cachedViews.value.filter((path) => !removedPaths.includes(path))
    tabs.splice(focusTabIndex.value + 1)
    if (focusTabIndex.value <= activeTabIndex.value) {
      const nextTab = tabs[tabs.length - 1]
      ChangeTab(nextTab)
    }
  } else if (type === 'others') {
    // 다른 모든 탭 닫기
    const keepPath = tabs[focusTabIndex.value].path
    cachedViews.value = cachedViews.value.filter((path) => path === keepPath)
    const keepTab = tabs[focusTabIndex.value]
    tabs.splice(0, tabs.length)
    tabs.push(keepTab)
    ChangeTab(keepTab)
  }
}

/**
 * 페이지 새로고침 함수
 * @param {String} result - 새로고침 결과
 */
const refresh = (result) => {
  if (result === 'Success') {
    window.location.reload()
  } else {
    router.push('/error/401')
  }
}

// 메뉴 경로 찾기 함수
const findMenuPath = (menuList, targetPath, parentPath = []) => {
  if (targetPath === '/') {
    navigationItems.value = [{ title: 'Home', disabled: false }]
    return true
  }
  for (const menu of menuList) {
    const currentPath = [...parentPath, menu]

    // 현재 메뉴의 path가 targetPath와 일치하거나
    // children이 없는 2레벨 메뉴인 경우도 체크
    if (menu.path === targetPath) {
      navigationItems.value = currentPath.map((item) => ({
        title: item.title,
        disabled: false,
      }))
      return true
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuPath(menu.children, targetPath, currentPath)
      if (found) return true
    }
  }
  return false
}

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  try {
    // 초기화 전에 약간의 지연을 두어 store들이 준비될 시간을 줍니다
    await nextTick()
    await updateSelectedTab(router.name, route.path)
    routeStore.setPageLeave(true)

    // 라우터 변경 이벤트 리스너
    router.afterEach(async (to, from) => {
      try {
        // 라우터 변경 시 약간의 지연을 두어 상태 업데이트가 완료될 시간을 줍니다
        await nextTick()
        
        if (routeStore.getPageLeave) {
          await routeStore.setCurrentRoute(to)
          await pageStore.setActivePage(to)
          await updateSelectedTab(to.name, to.path)
          routeStore.setPageLeave(true)
        } else {
          await pageStore.setActivePage(from)
        }
      } catch (error) {
        // 에러가 발생해도 라우터 이동을 계속 진행
      }
    })
    
    // 팝업 닫기 이벤트 리스너
    document.addEventListener('click', closePopup, true)
  } catch (error) {
    // 에러가 발생해도 애플리케이션 동작에 영향을 주지 않도록 조용히 처리
  }
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  document.removeEventListener('click', closePopup, true)
})

// 활성화된 탭이 변경될 때마다 네비게이션 아이템 업데이트
watch(
  () => activeTabIndex.value,
  () => {
    if (tabs.length > 0) {
      const currentTab = tabs[activeTabIndex.value]
      if (currentTab) {
        findMenuPath(menus.value, currentTab.path)
      }
    }
  },
  { immediate: true },
)
</script>
<style>
.fade-enter-active {
  transition: all 0.3s;
}
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
