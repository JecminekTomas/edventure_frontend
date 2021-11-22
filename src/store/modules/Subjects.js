const state = {
    subjects: [],
    didLoadSubjects: false,
}

const getters = {
    subjects: state => state.subjects,
    didLoadSubjects: state => state.didLoadSubjects,
}

const actions = {
    async fetchSubjects({commit}, subjectId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/subjects', {params: {subjectId}});
        commit('setSubjects', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setSubjects: (state, subjects) => (state.subjects = subjects),
    startedDataDownload: state => state.didLoadSubjects = false,
    finishedDataDownload: state => state.didLoadSubjects = true,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}