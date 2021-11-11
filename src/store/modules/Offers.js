const state = {
    offers: [],
    didLoadOffers: false,
    showFilter: false
}

const getters = {
    offers: state => state.offers,
    showFilter: state => state.showFilter,
    didLoadOffers: state => state.didLoadOffers
}

const actions = {
    async fetchOffers({commit}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/offers');
        commit('setOffers', response.data);
        commit('finishedDataDownload');
    },

    async fetchOffersBySubject({commit}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/offers');
        commit('setOffers', response.data);
        commit('finishedDataDownload');
    },

    switchFilter({commit}) {
        commit('switchFilter')
    }
}

const mutations = {
    setOffers: (state, offers) => (state.offers = offers),
    startedDataDownload: state => state.didLoadOffers = false,
    finishedDataDownload: state => state.didLoadOffers = true,
    switchFilter: state => state.showFilter = !state.showFilter
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}