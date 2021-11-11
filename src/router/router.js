import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Register from "../views/Register";
import NotFound from "../views/NotFound";
import Offers from "../views/Offers";
import {tokenManager} from "../main";
import NewOffer from "../views/NewOffer";
import Profile from "../views/Profile";

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
        path: '/new_offer',
        name: 'newOffer',
        component: NewOffer,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
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
