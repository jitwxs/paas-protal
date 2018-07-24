import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import qs from 'qs'
import store from './store/store'
import echarts from "echarts"
import semantic from 'semantic'
import '../node_modules/semantic-ui-css/semantic.min.css'

Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, { size: 'small' });

//axios全局配置
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';

Vue.config.productionTip = false;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        //这里判断用户是否登录，我例子中是验证本地存储是否有token
        if (!sessionStorage.userToken) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
})

// 发送请求时拦截，转换数据格式
axios.interceptors.request.use( (config) => {
    if (sessionStorage.userToken) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `${sessionStorage.userToken}`;
    }
    if (config.method=="post" || config.method =="put"){
        config.data = qs.stringify(config.data);
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
},  (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (res) {
    if (res.data.code===28 || res.data.code===29 || res.data.code===30){
        router.replace({
            path:'/index'
        })
    }
    return res;
}, (err)=>{
    return Promise.reject(error);
});


new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
}).$mount('#app');
