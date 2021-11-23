const state = {
    offerDetail: null,
    didLoadOffer: false,
}

const getters = {
    offer: state => state.offerDetail,
    showFilter: state => state.showFilter,
    didLoadOffer: state => state.didLoadOffer
}

const actions = {
    async fetchOffer({commit}, id) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get(`/offers/${id}`);
        commit('setOffer', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setOffer: (state, offer) => (state.offerDetail = offer),
    startedDataDownload: state => state.didLoadOffer = false,
    finishedDataDownload: state => state.didLoadOffer = true,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}