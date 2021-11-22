const state = {
    faculties: [],
    didLoadFaculties: false,
}

const getters = {
    faculties: state => state.faculties,
    didLoadFaculties: state => state.didLoadFaculties
}

const actions = {
    async fetchFaculties({commit}, facultyId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/faculties', {params: {facultyId}});
        commit('setFaculties', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setFaculties: (state, faculties) => (state.faculties = faculties),
    startedDataDownload: state => state.didLoadFaculties = false,
    finishedDataDownload: state => state.didLoadFaculties = true,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}