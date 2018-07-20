<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import {router,asyncRouterMap} from './router/index.js'
    export default {
        name: 'App',
        data(){
            return {

            }
        },
        methods:{
            getRouterMap:function () {
                let vm = this;
                let routerMap = new Array();
                for (let i=0;i<asyncRouterMap.length;i++){
                    if (sessionStorage.getItem('currentRole') === asyncRouterMap[i].meta.roles){
                        routerMap.push(asyncRouterMap[i]);
                    }
                }
                vm.$router.addRoutes(routerMap);
            },

        },
        created(){
            if (!sessionStorage.getItem('userToken')) {
                return this.$router.push('/index');
            }
            this.getRouterMap();
        }
    }
</script>

<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
