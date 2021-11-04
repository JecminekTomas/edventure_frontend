import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Register from "../views/Register";
import NotFound from "../views/NotFound";
import Offers from "../views/Offers";
import {tokenManager} from "../main";


Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/offers',
        name: 'offers',
        component: Offers,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/*',
        name: 'notFound',
        component: NotFound
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta != null && to.meta.requireAuth === true) {
        if (tokenManager.isUserLogged()) {
            next()
        } else {
            next({name: 'login'})
        }
    } else {
        next()
    }
})

export default router
