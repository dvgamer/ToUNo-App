const state = {
  offline: false,
  loaded: false,
  wait: false
}

const mutations = {
  LOADED (state, offline) {
    state.offline = !offline
    state.loaded = true
  },
  WAIT (state) {
    state.wait = !state.wait
  }
}

export default {
  state,
  mutations
}
