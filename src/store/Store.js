import Vue from 'vue'
import Vuex from 'vuex'
import Offers from './modules/Offers';
import OfferDetail from "./modules/OfferDetail";
import Universities from "./modules/Universities";
import Faculties from "./modules/Faculties";
import Subjects from "./modules/Subjects";
import Reviews from './modules/Reviews'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Offers,
        OfferDetail,
        Universities,
        Faculties,
        Subjects,
        Reviews
    }
})