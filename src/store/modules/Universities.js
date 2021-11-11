const state = {
    universities: [],
    didLoadUniversities: false,
}

const getters = {
    universities: state => state.universities,
    showFilter: state => state.showFilter,
    didLoadUniversities: state => state.didLoadUniversities
}

const actions = {
    async fetchUniversities({commit}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/universities');
        commit('setUniversities', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setUniversities: (state, universities) => (state.universities = universities),
    startedDataDownload: state => state.didLoadUniversities = false,
    finishedDataDownload: state => state.didLoadUniversities = true,
    switchFilter: state => state.showFilter = !state.showFilter
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}