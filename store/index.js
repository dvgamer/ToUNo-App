import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      newAnime: false,
      initApp: false
    },
    mutations: {
      setInitApp (state, data) {
        state.initApp = data
      },
      toggleNewAnime (state) {
        state.newAnime = !state.newAnime
      }
    }
  })
}

export default createStore