
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

import mixin from './views/mixin'

export const serverBus = new Vue();

new Vue({
  router,
  render: h => h(App),

}).$mount('#app')