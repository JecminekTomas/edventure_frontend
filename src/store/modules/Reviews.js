const state = {
    reviews: [],
    didLoadReviews: false,
}

const getters = {
    reviews: state => state.reviews,
    didLoadReviews: state => state.didLoadReviews
}

const actions = {
    async fetchReviews({commit}, {id, who}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get(`/reviews/${who}/${id}`);
        commit('setReviews', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setReviews: (state, reviews) => (state.reviews = reviews),
    startedDataDownload: state => state.didLoadReviews = false,
    finishedDataDownload: state => state.didLoadReviews = true,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}