let state = {
  offline: false,
  loaded: false,
  alert: false,
  wait: false
}

let mutations = {
  ONLINE (state, online) {
    state.offline = !online
    state.loaded = true
  },
  LOADED (state) {
    state.alert = true
  },
  'APP-PAUSE' (state) {
    state.wait = !state.wait
  }
}

export default {
  state,
  mutations
}
