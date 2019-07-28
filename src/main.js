// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import socketIo from "./classes/socketIoplugin"
import gamepad from "./classes/gamePadplugin"
import store from "./store/index"
import axios from "axios"
import echarts from 'echarts'


Vue.use(socketIo);
Vue.use(gamepad);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  store,
  template: '<App/>'
})
