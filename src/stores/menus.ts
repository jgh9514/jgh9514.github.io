/* eslint-disable @typescript-eslint/no-explicit-any */
export const useMenuStore = defineStore('ds-menus', {
  state: () => ({
    allMenus: [],
    menus: [],
    activeMenu: [],
    activePage: [],
  }),
  getters: {
    getMenuState: (state): object => state.menus,
    getAllMenus: (state): object => state.allMenus,
    getActiveMenu: (state): object => state.activeMenu,
    getActivePage: (state): object => state.activePage,
  },

  actions: {
    async fetch() {
      this.allMenus = await $api.post('/comm/menus', {});
      this.menus = await getServerMenusData(this.allMenus);
    },
    setActiveMenu(menuNo: string) {
      if (menuNo === '0') {
        this.activeMenu = JSON.parse(JSON.stringify(this.menus));
      } else {
        const selectedMenu = this.menus.find(parent => parent.menu_id === menuNo);

        this.activeMenu = selectedMenu.children;
      }
    },
    setActivePage(path: string) {
      this.activePage = this.allMenus.find(menu => menu.menu_url === path);
    },
  },
  persist: {
    enabled: false, // 메모리에 저장하지 않도록 변경
  },
});

export const getServerMenusData = async (allMenus: any[]) => {
  let items: any[] = [];

  const result = allMenus;

  // 결과 데이터의 각 아이템을 반복합니다.
  for (const item of result) {
    // 아이템이 1단계 메뉴 아이템인 경우(레벨 1), items 배열에 추가합니다.
    if (item.level === 0) {
      items.push({
        menu_id: item.menu_id,
        title: item.menu_nm,
        path: item.menu_url,
        level: item.level,
        pr_menu_id: item.pr_menu_id,
        children: [], // 향후 중첩 아이템을 위한 빈 자식 배열을 초기화합니다.
      });
    }
    // 아이템이 2단계 메뉴 아이템인 경우(레벨 2), 부모를 찾고 부모의 자식 배열에 추가합니다.
    else if (item.level === 1) {
      const parent = items.find(parent => parent.menu_id === item.pr_menu_id);
      if (parent) {
        parent.children.push({
          menu_id: item.menu_id,
          title: item.menu_nm,
          path: item.menu_url,
          level: item.level,
          pr_menu_id: item.pr_menu_id,
          children: [], // 향후 중첩 아이템을 위한 빈 자식 배열을 초기화합니다.
        });
      }
    }
    // 아이템이 3단계 메뉴 아이템인 경우(레벨 3), 부모를 찾고 부모의 자식 배열에 추가합니다.
    else if (item.level === 2) {
      findParentAndPushChild(items, item.pr_menu_id, {
        menu_id: item.menu_id,
        title: item.menu_nm,
        path: item.menu_url,
        level: item.level,
        pr_menu_id: item.pr_menu_id,
      });
    }
  }

  items = items.map(item => ({ ...item, children: item.children.length > 0 ? item.children : undefined }));

  return items;
};

// 서버에서 메뉴 데이터를 가져와서 레벨에 따라 중첩 구조로 정리합니다.
export const findParentAndPushChild = (
  items: any[],
  parentId: any,
  child: { menu_id: any, title: any, path: any, level: any, pr_menu_id: any },
) => {
  for (const item of items) {
    if (item.menu_id === parentId) {
      if (item.children) {
        item.children.push(child);
      } else {
        item.children = [child];
      }
      return;
    }
    if (item.children) {
      findParentAndPushChild(item.children, parentId, child);
    }
  }
};
