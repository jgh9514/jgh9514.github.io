export const loading = ref(false)
let loadingCount = 0

const baseFetch = async (url: string, method: string, params = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': Constants.HEADERS_CONTENT_TYPE_APPLICATION_JSON,
      'Authorization': useCookie(Constants.HEADERS_SMW_AUTHORIZATION).value
    }
  }

  try {
    loadingCount++
    loading.value = true

    const isBodyMethod = ['POST', 'PUT'].includes(method)
    const requestUrl = isBodyMethod 
      ? `${Constants.BASE_URL}/api/v1${url}`
      : `${Constants.BASE_URL}/api/v1${url}?${new URLSearchParams(params).toString()}`

    const requestOptions = {
      ...defaultOptions,
      method,
      ...(isBodyMethod && { body: JSON.stringify(params) })
    } as RequestInit

    const response = await fetch(requestUrl, requestOptions)
    if (!response.ok) {
      const errorMessages: { [key: number]: string } = {
        400: '잘못된 요청입니다',
        401: '인증이 필요합니다',
        403: '접근이 거부되었습니다', 
        404: '요청한 리소스를 찾을 수 없습니다',
        500: '서버 내부 오류가 발생했습니다',
        502: '게이트웨이 오류가 발생했습니다',
        503: '서비스를 사용할 수 없습니다'
      }

      if (response.status === 401) {
        navigateTo('/authInfo')
      } else if (response.status === 403) {
        navigateTo('/forbidden')
      } else if (response.status === 404) {
        navigateTo('/notfound')
      } else {
        navigateTo('/errorInfo')
      }

      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
      throw new Error(errorMessages[response.status] || `HTTP 오류! 상태: ${response.status}`)
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
    throw error
  }
}

export const $api = {
  get: (url: string, params = {}) => baseFetch(url, 'GET', params),
  post: (url: string, body = {}) => baseFetch(url, 'POST', body),
  delete: (url: string, params = {}) => baseFetch(url, 'DELETE', params),
  put: (url: string, body = {}) => baseFetch(url, 'PUT', body)
}

// RTA API를 위한 별도 서비스 함수들
const rtaBaseFetch = async (url: string, method: string, params = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': Constants.HEADERS_CONTENT_TYPE_APPLICATION_JSON
    }
  }

  try {
    loadingCount++
    loading.value = true

    const isBodyMethod = ['POST', 'PUT'].includes(method)
    const requestUrl = isBodyMethod 
      ? `${Constants.BASE_URL}${url}`
      : `${Constants.BASE_URL}${url}?${new URLSearchParams(params).toString()}`

    const requestOptions = {
      ...defaultOptions,
      method,
      ...(isBodyMethod && { body: JSON.stringify(params) })
    } as RequestInit

    const response = await fetch(requestUrl, requestOptions)
    if (!response.ok) {
      const errorMessages: { [key: number]: string } = {
        400: '잘못된 요청입니다',
        401: '인증이 필요합니다',
        403: '접근이 거부되었습니다', 
        404: '요청한 리소스를 찾을 수 없습니다',
        500: '서버 내부 오류가 발생했습니다',
        502: '게이트웨이 오류가 발생했습니다',
        503: '서비스를 사용할 수 없습니다'
      }

      loadingCount--
      if (loadingCount === 0) {
        loading.value = false
      }
      throw new Error(errorMessages[response.status] || `HTTP 오류! 상태: ${response.status}`)
    }

    const contentType = response.headers.get('Content-Type')
    let result;
    if (contentType && contentType.includes('application/json')) {
        result = await response.json()
    } else {
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
    throw error
  }
}

export const $rtaApi = {
  get: (url: string, params = {}) => rtaBaseFetch(url, 'GET', params),
  post: (url: string, body = {}) => rtaBaseFetch(url, 'POST', body),
  delete: (url: string, params = {}) => rtaBaseFetch(url, 'DELETE', params),
  put: (url: string, body = {}) => rtaBaseFetch(url, 'PUT', body)
}
