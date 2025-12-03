export const loading = ref(false)
let loadingCount = 0

const baseFetch = async (url: string, method: string, params = {}) => {
  // Capacitor 환경에서는 Preferences에서 토큰 가져오기
  let token = ''
  if (process.client && window.Capacitor) {
    const { CapacitorStorage } = await import('~/utils/capacitorStorage')
    token = await CapacitorStorage.getToken() || ''
  } else {
    // 웹 환경에서는 쿠키에서 토큰 가져오기
    token = useCookie(Constants.HEADERS_SMW_AUTHORIZATION).value || ''
  }

  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': Constants.HEADERS_CONTENT_TYPE_APPLICATION_JSON,
      'Authorization': token
    }
  }

  try {
    loadingCount++
    loading.value = true

    const requestUrl = `${Constants.BASE_URL}/api/v1${url}`

    const requestOptions = {
      ...defaultOptions,
      method,
      body: JSON.stringify(params)
    } as RequestInit

    const response = await fetch(requestUrl, requestOptions)
    if (!response.ok) {
      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }

      if (response.status === 401) {
        return navigateTo('/error/401')
      } else if (response.status === 403) {
        return navigateTo('/error/403')
      } else if (response.status === 404) {
        return navigateTo('/notfound')
      } else {
        return navigateTo('/error/500')
      }
    }

    const contentType = response.headers.get('Content-Type')
    let result;
    if (contentType && contentType.includes('application/json')) {
        result = await response.json()
    } else {
        // file 다운로드의 경우 content-type 이 application/octet-stream 으로 들어오기 때문에
        // json() 함수가 제대로 작동하지 않음.
        // blob() 로 꺼낸다.
        result = await response.blob();
    }

    loadingCount--
    if (loadingCount === 0) {
      loading.value = false
    }
    return result

  } catch (error) {
    loadingCount--
    if (loadingCount === 0) {
      loading.value = false
    }
    // 네트워크 에러나 CORS 에러 등으로 인한 fetch 실패 시 에러 페이지로 이동
    console.error('API 요청 실패 (네트워크/CORS 에러):', error)
    return navigateTo('/error/500')
  }
}

export const $api = {
  post: (url: string, body = {}) => baseFetch(url, 'POST', body)
}
