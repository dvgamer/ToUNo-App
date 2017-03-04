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
  anime_prepare_item (state, index) {
    state.saved.items.forEach(item => { item.prepare = false })
    if (index !== undefined) state.saved.items[index].prepare = true
  },
  anime_remove_items (state, index) {
    state.saved.items[index].verify = !state.saved.items[index].verify
  },
  anime_folder (state, data) {
    state.saved.items[data.index].name = data.name
  },
  anime_selected (state, data) {
    state.saved.items[data.index].name_search = data.name
  },
  anime_anilist (state, data) {
    state.saved.items[data.index].anilist = data.id
  },
  anime_search (state, data) {
    state.saved.items[data.index].anime = data.item
  },
  anime_save (state, data) {
    state.saved.items[data.index].name = data.name
    state.saved.items[data.index].anime_id = data.anime_id
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
