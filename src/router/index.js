import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/index',
            name: 'index',
            component: (resolve) => require(['../components/page_u/index.vue'], resolve)
        },
        {
            path: '/Login',
            name: 'Login',
            component: (resolve) => require(['../components/page/Login.vue'], resolve)
        },
        {
            // register
            path: '/Register',
            component: resolve => require(['../components/page/Register.vue'], resolve),
            meta: {title: '注册页面'}
        },
    ],

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
    }
});

export default router;

export const asyncRouterMap = [
    // 2 表示该路由组是系统管理员的界面
    {
        path: '/',
        meta: {
            title: '自述文件',
            roles: '2',
            requiresAuth: true,
        },
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children: [
            {
                path: 'xitongshouye',
                component: resolve => require(['../components/page/XiTongShouYe.vue'], resolve),
                meta: {title: '系统首页'}
            },
            {
                path: '/usermanage',
                component: resolve => require(['../components/page/UserManage.vue'], resolve),
                meta: {title: '用户管理'},
            },
            {
                path: '/tokenmanage',
                component: resolve => require(['../components/page/TokenManage.vue'], resolve),
                meta: {title: 'Token管理'},
            },
            {
                path: '/projectmanage',
                component: resolve => require(['../components/page/ProjectManage.vue'], resolve),
                meta: {title: '项目管理'},
            },
            {
                path: '/projectdetails',
                component: resolve => require(['../components/page/ProjectsDetails.vue'], resolve),
                meta: {title: '项目详情'},
            },

            {
                path: '/containermanage',
                component: resolve => require(['../components/page/ContainerManage.vue'], resolve),
                meta: {title: '容器管理'},
            },
            {
                path: '/containerdetails',
                component: resolve => require(['../components/page/ContainerDetails.vue'], resolve),
                meta: {title: '容器详情'},
            },
            {
                path: '/imagemanage',
                component: resolve => require(['../components/page/ImageManage.vue'], resolve),
                meta: {title: '镜像管理'},
            },
            {
                path: '/publiclocalimage',
                component: resolve => require(['../components/page/PublicLocalImage.vue'], resolve),
                meta: {title: '公共镜像详情'},
            },
            {
                path: '/userlocalimage',
                component: resolve => require(['../components/page/UserLocalImage.vue'], resolve),
                meta: {title: '用户镜像详情'},
            },
            {
                path: '/networkmanage',
                component: resolve => require(['../components/page/NetworkManage.vue'], resolve),
                meta: {title: '网络管理'},
            },
            {
                path: '/volumesmanage',
                component: resolve => require(['../components/page/VolumesManage.vue'], resolve),
                meta: {title: '数据卷管理'},
            },
            {
                path: '/servicemanage',
                component: resolve => require(['../components/page/ServiceManage.vue'], resolve),
                meta: {title: '服务管理'},
            },
            {
                path: '/servicedetails',
                component: resolve => require(['../components/page/ServiceDetails.vue'], resolve),
                meta: {title: '服务详情'},
            },
            {
                path: '/noticemanage',
                component: resolve => require(['../components/page/NoticeManage.vue'], resolve),
                meta: {title: '通知管理'},
            },
            {
                path: '/systemlog',
                component: resolve => require(['../components/page/SystemLog.vue'], resolve),
                meta: {title: '系统日志'},
            },
            {
                path: '/programmanage',
                component: resolve => require(['../components/page/ProgramManage.vue'], resolve),
                meta: {title: '程序管理'},
            },
            {
                path: '/403',
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: {title: '403页面'}
            },
            {
                path: '/NoticePage',
                component: resolve => require(['../components/page/NoticePage.vue'], resolve),
                meta: {title: '个人通知'}
            },
            {
                path: '/portainer',
                component: resolve => require(['../components/page/Portainer.vue'], resolve),
                meta: {title: 'portainer监控'}
            },
            {
                path: '/visualizer',
                component: resolve => require(['../components/page/Visualizer.vue'], resolve),
                meta: {title: 'visualizer监控'}
            },
            {
                path: '*',
                redirect: '/404'
            }
        ]
    },
    {
        path: '/',
        meta: {
            title: '自述文件',
            roles: '1',
            requiresAuth: true
        },
        component: resolve => require(['../components/common_u/Home_u.vue'], resolve),
        children: [
            {
                path: 'xitongshouye_u',
                component: resolve => require(['../components/page_u/XiTongShouYe_u.vue'], resolve),
                meta: {title: '系统首页'}
            },
            {
                path: '/projectPage',
                component: resolve => require(['../components/page_u/projectPage.vue'], resolve),
                meta: {title: '项目管理'}
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page_u/Markdown.vue'], resolve),
                meta: {title: 'markdown编辑器'}
            },
            {
                path: '/projectContainer',
                component: resolve => require(['../components/page_u/projectContainer.vue'], resolve),
                meta: {title: '项目容器'}
            },
            {
                path: '/containerAllList',
                component: resolve => require(['../components/page_u/containerAllList.vue'], resolve),
                meta: {title: '项目容器'}
            },
            {
                path: '/addContainer',
                component: resolve => require(['../components/page_u/addContainer.vue'], resolve),
                meta: {title: '添加容器'}
            },
            {
                path: '/addService',
                component: resolve => require(['../components/page_u/addService.vue'], resolve),
                meta: {title: '添加服务'}
            },
            {
                path: '/service',
                component: resolve => require(['../components/page_u/service.vue'], resolve),
                meta: {title: '服务'}
            },
            {
                path: '/serviceDetails_u',
                component: resolve => require(['../components/page_u/serviceDetails.vue'], resolve),
                meta: {title: '服务详情'}
            },
            {
                path: '/containerDetails',
                component: resolve => require(['../components/page_u/containerDetails.vue'], resolve),
                meta: {title: '容器详情'}
            },
            {
                path: '/netWork',
                component: resolve => require(['../components/page_u/netWork.vue'], resolve),
                meta: {title: '网络'}
            },
            {
                path: '/networkDetails',
                component: resolve => require(['../components/page_u/networkDetails.vue'], resolve),
                meta: {title: '网络详情'}
            },
            {
                path: '/createNetwork',
                component: resolve => require(['../components/page_u/createNetwork.vue'], resolve),
                meta: {title: '创建网络'}
            },
            {
                path: '/mirror',
                name: 'mirror',
                component: resolve => require(['../components/page_u/mirror/mirror.vue'], resolve),
                meta: {title: '我的镜像'}
            },
            {
                path: '/publicmirror',
                name: 'mirror',
                component: resolve => require(['../components/page_u/mirror/publicMirror.vue'], resolve),
                meta: {title: '公共镜像'}
            },
            {
                path: '/mirrorDetail',
                name: 'mirrorDetail',
                component: resolve => require(['../components/page_u/mirror/mirrorDetail.vue'], resolve),
                children: [
                    {
                        path: 'detail',
                        component: resolve => require(['../components/page_u/mirror/detail.vue'], resolve),
                        meta: {title: '镜像详情'}
                    },
                    {
                        path: 'history',
                        component: resolve => require(['../components/page_u/mirror/history.vue'], resolve),
                        meta: {title: '镜像历史'}
                    },
                ]
            },
            {
                path: '/NoticePage',
                component: resolve => require(['../components/page_u/NoticePage.vue'], resolve),
                meta: {title: '个人通知'}
            },
            {
                path: '/help',
                name: 'help',
                component: resolve => require(['../components/page_u/help.vue'], resolve),
                meta: {title: '帮助'}
            },
            {
                path: '*',
                redirect: '/404'
            }
        ]
    }
];
