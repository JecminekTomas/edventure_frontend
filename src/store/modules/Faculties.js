const state = {
    faculty: null,
    faculties: [],
    didLoadFaculties: false,
}

const getters = {
    faculty: state => state.faculty,
    faculties: state => state.faculties,
    didLoadFaculties: state => state.didLoadFaculties
}

const actions = {
    async fetchFaculties({commit}, universityId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/faculties', {params: {universityId: universityId}});
        commit('setFaculties', response.data);
        commit('finishedDataDownload');
    },

    async fetchFacultyById({commit}, faculty) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get(`/faculties/${faculty}`);
        commit('setFaculty', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setFaculty: (state, faculty) => (state.faculty = faculty),
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