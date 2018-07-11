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
                path: '/usertoproject',
                component: resolve => require(['../components/page/UserToProject.vue'],resolve),
                meta: { title: '用户的项目' },
            },
            {
                path:'/projectmanage',
                component: resolve => require(['../components/page/ProjectManage.vue'],resolve),
                meta: { title: '项目管理' },
            },
            {
                path:'/projecttocontainer',
                component: resolve => require(['../components/page/ProjectToContainer.vue'],resolve),
                meta: { title: '项目的容器' },
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
                path:'/repositorymanage',
                component: resolve => require(['../components/page/RepositoryManage.vue'],resolve),
                meta: { title: '仓储管理' },
            },
            {
                path:'/imagemanage',
                component: resolve => require(['../components/page/ImageManage.vue'],resolve),
                meta: { title: '镜像管理' },
            },
            {
                path:'/imagedetails',
                component: resolve => require(['../components/page/ImageDetails.vue'],resolve),
                meta: { title: '镜像详情' },
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
            {
                // vue-schart组件
                path: '/charts',
                component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                meta: { title: 'schart图表' }
            },
            {
                path: '/form',
                component: resolve => require(['../components/page/BaseForm.vue'],resolve),
                meta: { title: 'tab选项卡' }
            },

            {
                // 拖拽列表组件
                path: '/drag',
                component: resolve => require(['../components/page/DragList.vue'], resolve),
                meta: { title: '拖拽列表' }
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page/Markdown.vue'], resolve),
                meta: { title: 'markdown编辑器' }
            },
            {
                path: '/permission',
                component: resolve => require(['../components/page/Permission.vue'], resolve),
                meta: { title: '权限测试' }
            },
            {
                path: '/tabs',
                component: resolve => require(['../components/page/Tabs.vue'],resolve),
                meta: { title: '基础表格' }
            },
            {
                // 图片上传组件
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve),
                meta: { title: '文件上传' }
            },
            {
                // 富文本编辑器组件
                path: '/editor',
                component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                meta: { title: '富文本编辑器' }
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
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: { title: '403页面' }
            },
            {
                path: '/404',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404页面' }
            },
            {
                // vue-schart组件
                path: '/charts',
                component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                meta: { title: 'schart图表' }
            },
            {
                path: '/form',
                component: resolve => require(['../components/page/BaseForm.vue'],resolve),
                meta: { title: '基础表单' }
            },

            {
                // 拖拽列表组件
                path: '/drag',
                component: resolve => require(['../components/page/DragList.vue'], resolve),
                meta: { title: '拖拽列表' }
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page/Markdown.vue'], resolve),
                meta: { title: 'markdown编辑器' }
            },
            {
                path: '/permission',
                component: resolve => require(['../components/page/Permission.vue'], resolve),
                meta: { title: '权限测试' }
            },
            {
                path: '/tabs',
                component: resolve => require(['../components/page/Tabs.vue'],resolve),
                meta: { title: 'tabs选项卡' }
            },
            {
                // 图片上传组件
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve),
                meta: { title: '文件上传' }
            },
            {
                // 富文本编辑器组件
                path: '/editor',
                component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                meta: { title: '富文本编辑器' }
            },

        ]
    }
]
