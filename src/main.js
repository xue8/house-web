import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
// 百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  /* 需要注册百度地图开发者来获取你的ak */
  ak: 'KSeZ21g2XkMikVIeRkr02NYr5narPhPH'
})

Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios
Vue.use(VueAxios, axios);
// axios.defaults.timeout = 5000 // 请求超时
// axios.defaults.baseURL = 'http://127.0.0.1:8080/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
