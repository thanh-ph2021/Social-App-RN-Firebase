import axios from "axios"
import queryString from "query-string"

const axiosClient = axios.create({
    paramsSerializer: params => queryString.stringify(params)
})


axiosClient.interceptors.request.use(async (config: any) => {
    config.headers = {
        Authorization: '',
        Accept: 'application/json',
        ...config.headers
    }

    return config
}, error => {
    console.log("🚀 ~ axiosClient.interceptors.request.use ~ error:", error)
    return Promise.reject(error)
})

axiosClient.interceptors.response.use(
    response => {
        if (response.data && response.status === 200) {
            return response.data
        }
        throw new Error(`🚀 ~ axiosClient.interceptors.response.use ~ error ${JSON.stringify(response)}`)
    },
    error => {
        console.log("🚀 ~ axiosClient.interceptors.response.use ~ error:", JSON.stringify(error))

        return Promise.reject(error)
    })

export default axiosClient
