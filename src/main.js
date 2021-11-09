import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axiosInstance from "./helpers/http";
import TokenManager from "./helpers/token-manager"
import "./assets/global.css"

Vue.config.productionTip = false;

Vue.prototype.$http = axiosInstance;

export const tokenManager = new TokenManager();
tokenManager.renew();

Vue.prototype.$tokenManager = tokenManager

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
