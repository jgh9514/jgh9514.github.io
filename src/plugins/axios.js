export default function ({ $axios, redirect, store }) {
    $axios.onRequest((config) => {
        store._vm.$nextTick(() => {
            store._vm.$nuxt.$loading.start()
            return config
        })
    })

    $axios.onResponse((response) => {
        store._vm.$nextTick(() => {
            store._vm.$nuxt.$loading.finish()

            return response
        })
    })

    $axios.onError((error) => {
        const code = parseInt(error.response && error.response.status)
        console.warn('onError Code : ', code)
        if (code === 401) {
            redirect('/authInfo')
        } else if (code === 403) {
            redirect('/forbidden')
        } else if (code === 404) {
            redirect('/notfound')
        } else {
            redirect('/errorInfo')
        }
    })
}