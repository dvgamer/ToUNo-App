const state = {
  saved: null,
  cb: () => { },
  wait: false
}

const mutations = {
  anime_wait (state) {
    state.wait = !state.wait
  },
  anime_saved (state, anime) {
    state.saved = anime
  },
  anime_cb (state, cb) {
    if (cb) {
      state.cb = cb
    } else {
      state.cb()
    }
  },
  anime_remove_items (state, index) {
    state.saved.items[index].verify = !state.saved.items[index].verify
  },
  anime_change_folder (state, data) {
    state.saved.items[data.index].name = data.name
  },
  anime_search (state, data) {
    state.saved.items[data.index].anime = data.item
  },
  anime_reset (state) {
    state.saved = null
    state.wait = false
  }
}

export default {
  state,
  mutations
}
