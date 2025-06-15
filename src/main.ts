// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.setBackendsBaseUrl = function () {
    this.$backends_base_url = Vue.config.productionTip ? '123.249.90.144:8000' : '127.0.0.1:8000';
};

Vue.prototype.setBackendsBaseUrl(false); // 你可以根据需要设置初始值

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
