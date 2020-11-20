import Vue from 'vue'
import App from './App.vue';
import 'vant/lib/index.css';
import IdouComponent from './components/index.js'
const Vant = require('vant')
Vue.config.productionTip = false
Vue.use(Vant).use(IdouComponent)
new Vue({
  render: h => h(App),
}).$mount('#app')
