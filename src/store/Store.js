import Vue from 'vue'
import Vuex from 'vuex'
import Offers from './modules/Offers'
import Universities from "./modules/Universities";
import Faculties from "./modules/Faculties";
import Subjects from "./modules/Subjects";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Offers,
        Universities,
        Faculties,
        Subjects
    }
})