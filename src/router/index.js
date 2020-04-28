import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '@/components/HelloWorld'//設置 HelloWorld 為首頁
import Dashboard from '@/components/dashboard'
import Login from '@/components/pages/login'
import Products from '@/components/pages/Products'
import Coupons from '@/components/pages/Coupons'
import Orders from '@/components/pages/Orders'
import CustomerOrder from '@/components/pages/CustomerOrder'
import CustomerCheckOrder from '@/components/pages/CustomerCheckOrder'
Vue.use(VueRouter)
// 匯出給 main.js 使用
export default new VueRouter({
    routes: [
        {
            //  星號的 path ，不存在的頁面=> 無效
            path: '*',
            redirect: 'Login',
        },
        // {
        //     path: '/',
        //     name: 'HelloWorld',
        //     component: Home,
        //     // 導航訊息
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        }, {
            path: '/admin',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'products',
                    name: 'Products',
                    component: Products,
                },
                {
                    path: 'coupons',
                    name: 'Coupons',
                    component: Coupons,
                    meta: { requiresAuth: true },
                },
                {
                    path: 'orders',
                    name: 'Orders',
                    component: Orders,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            name: 'Dashboard2',
            path: '/',
            component: Dashboard,
            children: [
                {
                    name: 'CustomerOrder',
                    path: 'customerOrder',
                    component: CustomerOrder,
                },

            ],
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            children: [
                {
                    path: 'customer_order',
                    name: 'CustomerOrder',
                    component: CustomerOrder,
                },
                {
                    // 動態路由 76 章有講解
                    path: 'customer_checkorder/:orderId',
                    name: 'CustomerCheckOrder',
                    component: CustomerCheckOrder,
                },
            ],
        },],
})