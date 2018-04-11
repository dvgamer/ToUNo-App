import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      initApp: false
    },
    mutations: {
      setInitApp (state, data) {
        state.initApp = data
      }
    }
  })
}

export default createStore