
const actions = {
    async postScore({helpful, reviewId}) {
       await this._vm.$http.post('/scores', {params: {helpful, reviewId}});
    },
}

export default {
    namespaced: true,
    actions,
}