import { createRouter, createWebHistory } from "vue-router";
import NProgress from 'nprogress';
import { useUserInfoStore } from "@/stores/userInfo";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/home",
        },

        {
            // 主页
            path: "/home",
            name: "home",
            component: () => import("@/views/home/home.vue"),
            meta: {
                title: '首页',
                noCache: true
            }
        },

        {
            path: "/login",
            name: "login",
            component: () => import("@/views/login/login.vue"),
            meta: {
                title: '登录',
                noCache: true
            }
        },

        {
            path: "/forget",
            name: "forget",
            component: () => import("@/views/login/forget.vue"),
            meta: {
                title: '找回密码',
                noCache: true
            }
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/login/register.vue"),
            meta: {
                title: '注册',
                noCache: true
            }
        },
        {
            path: "/user",
            name: 'user',
            component: () => import("@/views/user/UserCenter.vue"),
            meta: {
                title: '用户中心',
            },
            children: [
                {
                    path: 'info',
                    name: 'user-info',
                    component: () => import("@/views/user/UserInfo.vue"),
                    meta: {
                        title: '基本信息'
                    }
                },
                {
                    path: 'notification',
                    name: 'user-notification',
                    component: () => import("@/views/user/Notification.vue"),
                    meta: {
                        title: '消息管理'
                    }
                },
                {
                    path: 'follow',
                    name: 'user-follow',
                    component: () => import("@/views/user/UserInfo.vue"),
                    meta: {
                        title: '关注列表'
                    }
                },
                {
                    path: 'fans',
                    name: 'user-fans',
                    component: () => import("@/views/user/UserInfo.vue"),
                    meta: {
                        title: '粉丝列表'
                    }
                },
                {
                    path: 'content',
                    name: 'user-content',
                    component: () => import("@/views/user/UserInfo.vue"),
                    meta: {
                        title: '内容管理'
                    }
                },
        
            ]
        },

        {
            path: '/:catchAll(.*)',
            component: () => import('@/views/404.vue'),
            hidden: true
          }
    ],
});

// 进度条
NProgress.configure({ showSpinner: false });
// 白名单
const whiteList = ["/login", "/home"];

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title  = to.meta.title;
    const store = useUserInfoStore()
    const userInfo = store.state.userInfo

    // 没有登录信息, 不是白名单中的路由
    if (!userInfo && whiteList.indexOf(to.path) === -1) {
        next('/login')
        NProgress.done()
    }
    next()
});

router.afterEach(() => {
    NProgress.done()
})

export default router;
