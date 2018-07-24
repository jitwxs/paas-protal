<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#67C23A" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common_u/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'iconfont jitwxs-dashbord',
                        index: '/xitongshouye_u',
                        title: ' 仪表盘'
                    },
                    {
                        icon: 'iconfont jitwxs-project',
                        index: '/projectPage',
                        title: ' 项目'
                    },
                    {
                        icon: 'iconfont jitwxs-container',
                        index: '/containerAllList',
                        title: ' 容器'
                    },
                    {
                        icon: 'iconfont jitwxs-swarm',
                        index: '/service',
                        title: ' 服务'
                    },
                    {
                        icon: 'iconfont jitwxs-docker_image',
                        index: '/mirror',
                        title: ' 镜像',
                        subs:[
                            {
                                index:'/mirror',
                                title:'我的镜像'
                            },
                            {
                                index:'/publicMirror',
                                title:'公共镜像'
                            }
                        ]
                    },
                    {
                        icon: 'iconfont jitwxs-network',
                        index: '/netWork',
                        title: ' 网络'
                    },
                    {
                        icon: 'iconfont jitwxs-help',
                        index: '/help',
                        title: ' 帮助'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
