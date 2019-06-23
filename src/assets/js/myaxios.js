import axios from 'axios'

var myaxios = {}
myaxios.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 这个只会执行一次
  // axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config)
    if (!config.url.includes('login')) {
      config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config
  })

  Vue.prototype.$http = axios
}
export default myaxios
