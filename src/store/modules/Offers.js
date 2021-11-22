const state = {

    singleOffer: null,

    offers: [],
    didLoadOffers: false,
    showFilter: false,

    // Sorts
    priceSort: null,
    starsSort: null,
    starsCountSort: null,

    // Filters
    subjectFilter: null,
    priceFromFilter: null,
    priceToFilter: null,
    minStarsFilter: null,
    //onlineFilter: false
}

const getters = {

    singleOffer: state => state.singleOffer,

    getOffers: state => {

        let filteredOffers = state.offers.filter((i) => {
            return !state.subjectFilter || (i.subjectId === state.subjectFilter);
        })

        filteredOffers = filteredOffers.filter((i) => {
            return !state.priceFromFilter || (i.price >= state.priceFromFilter);
        })

        filteredOffers = filteredOffers.filter((i) => {
            return !state.priceToFilter || (i.price <= state.priceToFilter);
        })

        filteredOffers = filteredOffers.filter((i) => {
            return !state.minStarsFilter || (i.reviewBalance.starsAverage >= state.minStarsFilter);
        })

        // offers.filter((i) => {
        //     return !state.onlineFilter || i.onlineFilter;
        // })

        filteredOffers = filteredOffers.sort((a, b) => {
            if (state.priceSort === true)
                return (a.price - b.price)

            if (state.priceSort === false) {
                return (b.price - a.price)
            }
        });

        filteredOffers = filteredOffers.sort((a, b) => {
            if (state.starsSort === true)
                return (a.reviewBalance.starsAverage - b.reviewBalance.starsAverage)

            if (state.starsSort === false)
                return (b.reviewBalance.starsAverage - a.reviewBalance.starsAverage)
        });

        filteredOffers = filteredOffers.sort((a, b) => {
            if (state.starsCountSort === true)
                return (a.reviewBalance.reviewCount - b.reviewBalance.reviewCount)

            if (state.starsCountSort === false)
                return (b.reviewBalance.reviewCount - a.reviewBalance.reviewCount)
        });


        return filteredOffers
    },

    showFilter: state => state.showFilter,
    didLoadOffers: state => state.didLoadOffers
}

const actions = {

    async fetchSingleOffer({commit}, id) {
        commit('startedDataDownload');
        console.log('in')
        const response = await this._vm.$http.get(`/offers/${id}`);
        commit('setSingleOffer', response.data);
        commit('finishedDataDownload');
    },

    async fetchOffers({commit}) {
        commit('startedDataDownload')
        const response = await this._vm.$http.get('/offers');
        commit('setOffers', response.data);
        commit('finishedDataDownload');
    },

    async fetchOffersBySubject({commit}) {
        commit('startedDataDownload');
        const response = await this._vm.$http.get('/offers');
        commit('setOffers', response.data);
        commit('finishedDataDownload');
    },

    // SORTS
    setPriceSort({commit}, value) {
        commit('setPriceSort', value)
    },

    setStarsSort({commit}, value) {
        commit('setStarsSort', value)
    },

    setStarsCountSort({commit}, value) {
        commit('setStarsCountSort', value)
    },

    // FILTERS
    switchFilter({commit}, value) {
        commit('switchFilter', value)
    },

    setSubjectFilter({commit}, subjectId) {
        commit('setSubjectFilter', subjectId)
    },

    setPriceFromFilter({commit}, price) {
        commit('setPriceFromFilter', price)
    },

    setPriceToFilter({commit}, price) {
        commit('setPriceToFilter', price)
    },

    setMinStarsFilter({commit}, minStars) {
        commit('setMinStarsFilter', minStars)
    },

    // TODO: Rest of them
}

const mutations = {
    setSingleOffer: (state, singleOffer) => (state.singleOffer = singleOffer),

    setOffers: (state, offers) => (state.offers = offers),
    startedDataDownload: state => state.didLoadOffers = false,
    finishedDataDownload: state => state.didLoadOffers = true,

    switchFilter: (state, value) => state.showFilter = value,

    //SORT
    setPriceSort: (state, value) => {
        if (value === 1)
            state.priceSort = true

        else if (value === 2)
            state.priceSort = false

        else state.priceSort = null
    },

    setStarsSort: (state, value) => {
        if (value === 1)
            state.starsSort = true

        else if (value === 2)
            state.starsSort = false

        else state.starsSort = null
    },
    setStarsCountSort: (state, value) => {
        if (value === 1)
            state.starsCountSort = true

        else if (value === 2)
            state.starsCountSort = false

        else state.starsCountSort = null
    },

    // FILTER
    setSubjectFilter: (state, value) => state.subjectFilter = value,
    setPriceFromFilter: (state, value) => state.priceFromFilter = value,
    setPriceToFilter: (state, value) => state.priceToFilter = value,
    setMinStarsFilter: (state, value) => state.minStarsFilter = value,
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}