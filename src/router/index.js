import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/Login.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/Home.vue'),
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: 'welcome',
                component: () => import('@/components/Welcome'),
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('@/components/User/Users'),
            },
            {
                path: '/rights',
                name: 'rights',
                component: () => import('@/components/Power/Rights'),
            },
            {
                path: '/roles',
                name: 'roles',
                component: () => import('@/components/Power/Roles'),
            },
        ],
    },
]

const router = new VueRouter({
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()

    // 从sessionStorage获取token
    const tokenStr = window.sessionStorage.getItem('token')
    // 没有token跳转到登录
    if (!tokenStr) return next('/login')
    next()
})

export default router
