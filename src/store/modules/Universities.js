const state = {
    university: null,
    universities: [],
    didLoadUniversities: false,
}

const getters = {
    university: state => state.university,
    universities: state => state.universities,
    didLoadUniversities: state => state.didLoadUniversities
}

const actions = {
    async fetchUniversities({commit}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/universities');
        commit('setUniversities', response.data);
        commit('finishedDataDownload');
    },

    async fetchUniversityById({commit}, university) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get(`/universities/${university}`);
        commit('setUniversity', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setUniversity: (state, university) => (state.university = university),
    setUniversities: (state, universities) => (state.universities = universities),
    startedDataDownload: state => state.didLoadUniversities = false,
    finishedDataDownload: state => state.didLoadUniversities = true,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}