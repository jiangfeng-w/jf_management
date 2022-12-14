import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

// 导入路由
import router from './router'
// 引入图标库
import '@/assets/fonts/iconfont.css'
// 全局样式
import '@/assets/css/global.css'

// 导入
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
