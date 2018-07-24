<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
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
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'iconfont jitwxs-dashbord',
                        index: 'xitongshouye',
                        title: ' 仪表盘'
                    },
                    {
                        icon: 'iconfont jitwxs-user',
                        index: 'usermanage',
                        title: ' 用户管理',
                        subs: [
                            {
                                index: 'usermanage',
                                title: '用户信息'
                            },
                            {
                                index: 'tokenmanage',
                                title: 'Token信息'
                            },]

                    },
                    {
                        icon: 'iconfont jitwxs-project',
                        index: 'projectmanage',
                        title: ' 项目管理'
                    },
                    {
                        icon: 'iconfont jitwxs-container',
                        index: 'containermanage',
                        title: ' 容器管理'
                    },
                    {
                        icon: 'iconfont jitwxs-swarm',
                        index: 'servicemanage',
                        title: ' 服务管理'
                    },
                    {
                        icon: 'iconfont jitwxs-docker_image',
                        index: 'imagemanage',
                        title: ' 镜像管理'
                    },
                    {
                        icon: 'iconfont jitwxs-network',
                        index: 'networkmanage',
                        title: ' 网络管理'
                    },
                    {
                        icon: 'iconfont jitwxs-data',
                        index: 'volumesmanage',
                        title: ' 数据卷管理'
                    },
                    {
                        icon: 'iconfont jitwxs-notice',
                        index: 'noticemanage',
                        title: ' 通知管理'
                    },
                    {
                        icon: 'iconfont jitwxs-monitor',
                        title: ' 三方监控',
                        index:' ',
                        subs: [
                            {
                                index:'portainer',
                                title: 'portainer监控'
                            },
                            {
                                index:'visualizer',
                                title: 'visualizer监控'
                            }
                        ]
                    },
                    {
                        icon: 'iconfont jitwxs-system',
                        index: 'systemmanage',
                        title: ' 系统管理',
                        subs: [
                            {
                                index: 'systemlog',
                                title: '系统日志'
                            },
                            {
                                index: 'programmanage',
                                title: '程序信息'
                            }
                        ]
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
