import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router =  new Router({
    mode:'history',
    routes: [
        {
            path:'/',
            name:'login',
            component:(resolve) => require(['../components/page/Login.vue'],resolve)
        },
    ],

    scrollBehavior(to,from,savedPosition) {
        if (savedPosition){
            return savedPosition;
        }
    }
})

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
                path: '/xitongshouye',
                component: resolve => require(['../components/page/XiTongShouYe.vue'], resolve),
                meta: { title: '系统首页' }
            },
            {
                path: '/usermanage',
                component: resolve => require(['../components/page/UserManage.vue'],resolve),
                meta: { title: '用户管理' },
            },
            {
                path: '/tokenmanage',
                component: resolve => require(['../components/page/TokenManage.vue'],resolve),
                meta: { title: 'Token管理' },
            },
            {
                path:'/projectmanage',
                component: resolve => require(['../components/page/ProjectManage.vue'],resolve),
                meta: { title: '项目管理' },
            },
            {
                path:'/projectdetails',
                component: resolve => require(['../components/page/ProjectsDetails.vue'],resolve),
                meta: { title: '项目详情' },
            },

            {
                path:'/containermanage',
                component: resolve => require(['../components/page/ContainerManage.vue'],resolve),
                meta: { title: '容器管理' },
            },
            {
                path:'/containerdetails',
                component: resolve => require(['../components/page/ContainerDetails.vue'],resolve),
                meta: { title: '容器详情' },
            },
            {
                path:'/imagemanage',
                component: resolve => require(['../components/page/ImageManage.vue'],resolve),
                meta: { title: '镜像管理' },
            },
            {
                path:'/publiclocalimage',
                component: resolve => require(['../components/page/PublicLocalImage.vue'],resolve),
                meta: { title: '公共镜像详情' },
            },
            {
                path:'/userlocalimage',
                component: resolve => require(['../components/page/UserLocalImage.vue'],resolve),
                meta: { title: '用户镜像详情' },
            },
            {
                path:'/networkmanage',
                component: resolve => require(['../components/page/NetworkManage.vue'],resolve),
                meta: { title: '网络管理' },
            },
            {
                path:'/volumesmanage',
                component: resolve => require(['../components/page/VolumesManage.vue'],resolve),
                meta: { title: '数据卷管理' },
            },
            {
                path:'/servicemanage',
                component: resolve => require(['../components/page/ServiceManage.vue'],resolve),
                meta: { title: '服务管理' },
            },
            {
                path:'/servicedetails',
                component: resolve => require(['../components/page/ServiceDetails.vue'],resolve),
                meta: { title: '服务详情' },
            },
            {
                path:'/noticemanage',
                component: resolve => require(['../components/page/NoticeManage.vue'],resolve),
                meta: { title: '通知管理' },
            },
            {
                path:'/systemlog',
                component: resolve => require(['../components/page/SystemLog.vue'],resolve),
                meta: { title: '系统日志' },
            },
            {
                path:'/programmanage',
                component: resolve => require(['../components/page/ProgramManage.vue'],resolve),
                meta: { title: '程序管理' },
            },

            {
                path: '/403',
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: { title: '403页面' }
            },
            {
                path: '/404',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404页面' }
            },
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
                path: '/xitongshouye_u',
                component: resolve => require(['../components/page_u/XiTongShouYe_u.vue'], resolve),
                meta: { title: '系统首页' }
            },
            {
                path: '/projectmanage_u',
                component: resolve => require(['../components/page_u/ProjectManage_u.vue'], resolve),
                meta: { title: '项目管理' }
            },
            {
                path: '/projectdetails_u',
                component: resolve => require(['../components/page_u/ProjectDetails_u.vue'], resolve),
                meta: { title: '项目详情' }
            },
            {
                path: '/containermanage_u',
                component: resolve => require(['../components/page_u/ContainerManage_u.vue'], resolve),
                meta: { title: '容器管理' }
            },


            {
                path: '/403',
                component: resolve => require(['../components/page_u/403.vue'], resolve),
                meta: { title: '403页面' }
            },
            {
                path: '/404',
                component: resolve => require(['../components/page_u/404.vue'], resolve),
                meta: { title: '404页面' }
            },
            {
                // vue-schart组件
                path: '/charts',
                component: resolve => require(['../components/page_u/BaseCharts.vue'], resolve),
                meta: { title: 'schart图表' }
            },
            {
                path: '/form',
                component: resolve => require(['../components/page_u/BaseForm.vue'],resolve),
                meta: { title: '基础表单' }
            },

            {
                // 拖拽列表组件
                path: '/drag',
                component: resolve => require(['../components/page_u/DragList.vue'], resolve),
                meta: { title: '拖拽列表' }
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page_u/Markdown.vue'], resolve),
                meta: { title: 'markdown编辑器' }
            },
            {
                path: '/permission',
                component: resolve => require(['../components/page_u/Permission.vue'], resolve),
                meta: { title: '权限测试' }
            },
            {
                path: '/tabs',
                component: resolve => require(['../components/page_u/Tabs.vue'],resolve),
                meta: { title: 'tabs选项卡' }
            },
            {
                // 图片上传组件
                path: '/upload',
                component: resolve => require(['../components/page_u/Upload.vue'], resolve),
                meta: { title: '文件上传' }
            },
            {
                // 富文本编辑器组件
                path: '/editor',
                component: resolve => require(['../components/page_u/VueEditor.vue'], resolve),
                meta: { title: '富文本编辑器' }
            },

        ]
    }
]
