import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Register from "../views/Register";
import NotFound from "../views/NotFound";
import Offers from "../views/Offers";
import {tokenManager} from "../main";
import NewOffer from "../views/NewOffer";
import OfferDetail from "../views/OfferDetail";
import NewReview from "../views/NewReview";
import ProfileOverview from "../views/ProfileOverview";
import ProfileDetail from "../views/ProfileDetail";
import PasswordChange from "../views/PasswordChange";
import ReviewsFromUser from "../views/ReviewsFromUser";
import ReviewsToUser from "../views/ReviewsToUser";
import OffersFromUser from "../views/OffersFromUser";
import UpdateOffer from "../views/UpdateOffer";

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
        },
    },
    {
        path: "/offers/:offerId",
        component: OfferDetail,
        name: "offerDetail",
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/offers/:offerId/new_review",
        component: NewReview,
        name: "newReview",
        meta: {
            requireAuth: true
        },
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
        component: ProfileOverview,
        meta: {
            requireAuth: true
        },
        children: [
            {
                path: '/profile/detail',
                name: 'profileDetail',
                component: ProfileDetail
            },
            {
                path: '/profile/change_password',
                name: 'passwordChange',
                component: PasswordChange
            },
            {
                path: '/profile/reviews/from_me',
                name: 'reviewsFromUser',
                component: ReviewsFromUser
            },
            {
                path: '/profile/reviews/to_me',
                name: 'reviewsToUser',
                component: ReviewsToUser
            },
            {
                path: '/profile/offers',
                name: 'offersFromUser',
                component: OffersFromUser
            },
            {
                path: '/profile/offers/:offerId',
                name: 'updateOffer',
                component: UpdateOffer
            }
        ]
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
