// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
// 某些套件引入後需要做設定、承接，所以會使用到變數方式，如下
import VueAxios from 'vue-axios'
//下面兩隻都是 vue-loading ，第二個是 css
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// 單純引入 bootstrap ，有要使用有 jQ 功能的 BS 才要載入
import "bootstrap"
import App from './App'
import router from './router' //自動找到資料夾中的 index.js 檔案
import './bus'//載入 bus.js這個檔案
// 載入 filter 檔案，並賦予名稱
import currencyFilter from './filter/currency'
import dateFilter from './filter/date'

Vue.use(VueAxios, axios)
Vue.component('Loading',Loading)
//註冊filter，filter('自訂名稱'，元件) 
Vue.filter('currency',currencyFilter)
Vue.filter('date',dateFilter)

/* eslint-disable no-new */
axios.defaults.withCredentials = true
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,

})

// 導航首位，如果沒登入就進入指定網址會被阻擋，要求燈入
// 參數 1.to 要進入的頁面， 2. form 正要離開的頁面(當前)
// 首頁有設置 meta.requiresAuth==true ，所有 to.meta.requiresAuth==true 會驗證是否登入，是
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    console.log('需要驗證',to)
    // 驗證的 api
    const api = `${process.env.APIPATH}api/user/check`;
    // 由 this.$http 修改成 axios，因為這邊是在 router 插件的範圍下使用，而不是 vue 元件範圍下
    axios.post(api).then(response => {
      // 登入狀態成功=>放行，失敗=>返回登入 (/login) 頁面
      if (response.data.success) {
        next()
      }
      else{
        next({path:'/login'})
      }
    })
  } else {
    console.log('不需要驗證',to)
    next()
  }
})

