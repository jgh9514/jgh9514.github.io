/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Util 구현을 위한 Import 영역
 */
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from "vue-router"

////////////////////////////////////////////////////////////////////////////////
// Util
////////////////////////////////////////////////////////////////////////////////
/**
 * 값이 null, undefined 또는 빈 문자열인지 확인하는 함수
 */
export const $gfn_isNull = (value: unknown): boolean => {
  return value === null || value === undefined || value === ''
}

/**
 * 값이 없을 경우 기본값을 반환하는 함수
 */
export const $gfn_nvl = (value: unknown, defaultValue: unknown = ''): unknown => {
  return $gfn_hasValue(value) ? value : defaultValue
}

/**
 * 값이 문자열인지 확인하는 함수
 */
export const $gfn_isString = (value: unknown): boolean => {
  return typeof value === 'string'
}

/**
 * 값이 숫자인지 확인하는 함수
 */
export const $gfn_isNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value as number)
}

/**
 * 값이 불리언인지 확인하는 함수
 */
export const $gfn_isBoolean = (value: unknown): boolean => {
  return typeof value === 'boolean'
}

/**
 * 값이 배열인지 확인하는 함수
 */
export const $gfn_isArray = (value: unknown): boolean => {
  return Array.isArray(value)
}

/**
 * 값이 객체인지 확인하는 함수
 */
export const $gfn_isObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const $gfn_replaceAll = (value: string, search: string, replace: string) => {
  if (!$gfn_isString(value)) return value
  if ($gfn_isEmpty(value)) return null

  return value.replaceAll(search, replace)
}

/**
 * 값이 유효한지 확인하는 함수
 * - null, undefined, 빈 문자열이 아님
 * - 빈 문자열이 아님 (공백 제거 후)
 * - 빈 배열이 아님
 * - 빈 객체가 아님
 */
export const $gfn_hasValue = (value: unknown): boolean => {
  if ($gfn_isNull(value)) return false
  if ($gfn_isString(value) && (value as string).trim() === '') return false
  if ($gfn_isArray(value) && (value as unknown[]).length === 0) return false
  if ($gfn_isObject(value) && Object.keys(value as object).length === 0) return false
  return true
}

/**
 * 핸드폰 번호 형식이 맞는지 확인하는 함수
 * - 010-1234-5678 형식
 * - 011-123-4567 형식 
 */
export const $gfn_isPhoneNumber = (value: unknown): boolean => {
  if (!$gfn_isString(value)) return false
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
  return phoneRegex.test(value as string)
}

export const $gfn_getCurrentDate = () => {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
}

/**
 * YYYY-MM-DD 형식 또는 YYYYMMDD 형식
 */
export const $gfn_isYYYYMMDD = (value: unknown): boolean => {
  if (!$gfn_isString(value)) return false
  const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$|^[0-9]{8}$/
  return dateRegex.test(value as string)
}

export const $gfn_isRangeYYYYMMDD = (value: unknown): boolean => {
  if (!$gfn_isString(value)) return false
  const dateRegex = /^\s*[0-9]{4}-[0-9]{2}-[0-9]{2}\s*~\s*[0-9]{4}-[0-9]{2}-[0-9]{2}\s*$/
  return dateRegex.test(value as string)
}

export const $gfn_convertDateYYYYMMDD = (YYYYMMDDHH24MISS: string): string => {
  return YYYYMMDDHH24MISS.substring(0, 4) + ':' + YYYYMMDDHH24MISS.substring(4, 6) + ':' + YYYYMMDDHH24MISS.substring(6, 8) + ' ' + YYYYMMDDHH24MISS.substring(8, 10) + ':' + YYYYMMDDHH24MISS.substring(10, 12) + ':' + YYYYMMDDHH24MISS.substring(12, 14)
}

/**
 * 이메일 형식이 맞는지 확인하는 함수
 * - example@domain.com 형식
 */
export const $gfn_isEmail = (value: unknown): boolean => {
  if (!$gfn_isString(value)) return false
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(value as string)
}

export const $gfn_isEmpty = (value: unknown): boolean => {
  if (typeof value === "undefined" || value == undefined || value == null || value === "") return true;
  else return false;
}


export const $gfn_isEmptyProxyObject = (value: unknown): boolean => {
  if (typeof value === 'object' && value !== null) {

    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * 공통코드 조회
 * - 코드그룹번호로 공통코드 조회
 * @param codeGroup 
 * @returns 
 * 
 * 예시: const result = await $gfn_getCommonCode('CH00000011')
 */
export const $gfn_getCommonCode = async (codeGroup: string) => {
  const response = await $api.get(`/common/sm/cd?cd_grp_no=${codeGroup}`)
  return response.data
}
export const $gfn_getCommonCodeArray = async (codeGroups: { [key: string]: any }) => {
  for (const codeGroup in codeGroups) {
    const schData = {
      cd_grp_no: codeGroup,
    };
    const response = await $api.get(`/common/sm/cd`, schData);

    codeGroups[codeGroup] = {
      cd: response.map((item: { cd: any }) => item.cd),
      cd_nm: response.map((item: { cd_nm: any }) => item.cd_nm),
      up_cd: response.map((item: { up_cd: any }) => item.up_cd),
    };
  }
  return codeGroups;
};

export const $gfn_getCommonCodeArrayToHierarchy = async (codeGroup: string) => {
  const schData = {
    cd_grp_no: codeGroup
  }
  const response = await $api.get(`/common/sm/cd`, schData)
  const returnData = {  
    keys: [],
    values: [],
    tags: []
  }
  returnData.tags = response.map((item: { cd: any }) => item.cd)
  returnData.values = response.map((item: { cd_nm: any }) => item.cd_nm)
  returnData.keys = response.map((item: { up_cd: any, cd: any }) => [item.up_cd, item.cd])
  return returnData
}

////////////////////////////////////////////////////////////////////////////////
// Alert, Confirm, Apprvoal OK 다이얼로그
////////////////////////////////////////////////////////////////////////////////
export const $gfn_alert = (text: string) => {
  const alertStore = useAlertStore()
  alertStore.setAlertState(text)
}


export const $confirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmStore = useConfirmStore()
    confirmStore.callbackOkFn = () => resolve(true)
    confirmStore.callbackCancelFn = () => resolve(false)
    confirmStore.setConfirmState(title, content)
  })
}

export const $gfn_approval = () => {
}


////////////////////////////////////////////////////////////////////////////////
// 다국어
////////////////////////////////////////////////////////////////////////////////
export const $t = (code: any) => {
  return useNuxtApp().$i18n.t(code)
}

////////////////////////////////////////////////////////////////////////////////
// Store 관련
////////////////////////////////////////////////////////////////////////////////

export const $gfn_getCurrentRouterTab = () => {
  const currentRouterTabStore = useCurrentRouterTabStore()
  return currentRouterTabStore.$state.currentTab
}

export const $gfn_setCurrentRouterTab = (tabId: string) => {
  const currentRouterTabStore = useCurrentRouterTabStore()
  currentRouterTabStore.setCurrentRouterTabStore(tabId)
}
export const $gfn_searchDataExtraction = (schDatas: any) => {
  const extractedData: any = {};

  for (const key in schDatas) {
    if (!schDatas[key] && schDatas[key] !== 0) continue;

    if (typeof schDatas[key] === 'object') {
      extractedData[key] = schDatas[key].value !== undefined 
        ? schDatas[key].value 
        : schDatas[key];
    } else {
      extractedData[key] = schDatas[key];
    }
  }

  return extractedData;
};

export const $gfn_downloadFileByBlob = (blobData: any, filename: any) => {
  const blobUrl = URL.createObjectURL(blobData)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}

export const $gfn_setUser = (user: any) => {
  const userStore = useUserStore()
  userStore.setUserState(user)
}

export const $gfn_getUser = () => {
  const userStore = useUserStore()
  return userStore.getUserState
}

export const $gfn_isAdmin = () => {
  const userStore = useUserStore()

  const roles = userStore.getUserState.roles // EX: ['RZZZZ', 'R0001']
  // 'M01', '시스템 관리자', '시스템 관리자'
  // 'G01', '일반 사용자', '일반 사용자'
  // 'P01', '협력사 사용자', '협력사 사용자'
  // 'S01', '안전 관리자', '안전보건 담당자'
  // 'C01', '화학물질 담당자', '화학물질 담당자'
  const roleTpCds = userStore.getUserState.roleTpCds // EX: ['G01', 'M01']
  return roles.includes(Constants.ROLE_ADMIN_CD) || roleTpCds.includes(Constants.ROLE_ADMIN_TP_CD)
}

export const $gfn_getRole = () => {
  const userStore = useUserStore()
  const roles = userStore.getUserState.roles // EX: ['RZZZZ', 'R0001']
  return roles
}

export const $gfn_getRoleTpCd = () => {
  const userStore = useUserStore()
  const roleTpCds = userStore.getUserState.roleTpCds // EX: ['G01', 'M01']
  return roleTpCds
}

export const $gfn_getUrlParams = () => {
  const route = useRoute()
  return route.params
}

const url_router_data: any = {}
export const $gfn_go = (path: string, params: any) => {
  url_router_data[path] = params

  useRouteParam().value = url_router_data

  navigateTo({
    path: path,
  })
}

export const $gfn_getRouteParam = () => {
  const routeParam = useRouteParam().value
  if (!routeParam) return null
  const path = useRoute().path
  return routeParam[path as keyof typeof routeParam]
}
