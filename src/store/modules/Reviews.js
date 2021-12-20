const state = {
    reviews: [],
    didLoadReviews: false,
}

const getters = {
    reviews: state => state.reviews,
    didLoadReviews: state => state.didLoadReviews
}

const actions = {
    async fetchReviewsFrom({commit}, userFromId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/reviews', {params: {userFromId: userFromId}});
        commit('setReviews', response.data);
        commit('finishedDataDownload');
    },
    async fetchReviewsTo({commit}, userToId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/reviews', {params: {userToId: userToId}});
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