import Home from '@/views/Home.vue';
import HelloWorld from "@/components/HelloWorld";
import Router from "vue-router";
import Vue from "vue";

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: HelloWorld,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
    }
]

const router = new Router({
    routes
})

export default router