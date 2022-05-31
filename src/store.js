import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: false
    },
    mutations: {
        setBsc(state, bsc) {
            state.bsc = bsc
        },
    }
})
