const state = {
    contacts: [],
}

const getters = {
    contacts: state => state.contacts,
}

const actions = {
    setContacts({commit}, contacts) {
        commit('setContacts', contacts)
    },
}

const mutations = {
    setContacts: (state, contacts) => {
        state.doSetContacts = true
        state.contacts = contacts
        state.doSetContacts = false
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}