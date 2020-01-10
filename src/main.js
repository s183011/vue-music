import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import 'common/stylus/index.styl'
import axios from 'axios'
import store from './store'
axios.defaults.withCredentials = true
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
