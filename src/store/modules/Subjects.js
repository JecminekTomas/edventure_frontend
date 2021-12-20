const state = {
    subject: null,
    subjects: [],
    didLoadSubjects: false,
}

const getters = {
    subject: state => state.subject,
    subjects: state => state.subjects,
    didLoadSubjects: state => state.didLoadSubjects,
}

const actions = {
    async fetchSubjects({commit}, facultyId) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/subjects', {params: {facultyId: facultyId}});
        commit('setSubjects', response.data);
        commit('finishedDataDownload');
    },

    async fetchSubjectById({commit}, subject) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get(`/subjects/${subject}`);
        commit('setSubject', response.data);
        commit('finishedDataDownload');
    },
}

const mutations = {
    setSubject: (state, subject) => (state.subject = subject),
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