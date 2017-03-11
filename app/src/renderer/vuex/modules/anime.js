const state = {
  path: null,
  loadding: false,
  source: [],
  items: []
}

const mutations = {
  'anime-set_path' (state, path) {
    state.path = path
    if (!path && path !== '') {
      state.source.push(path)
    }
  },
  'anime-add_items' (state, items) {
    state.items = items
  },
  'anime-loadding' (state) {
    state.loadding = !state.loadding
  }
  // anime_wait (state) {
  //   state.wait = !state.wait
  // },

  // anime_cb (state, cb) {
  //   if (typeof cb === 'function') {
  //     state.cb = cb
  //   } else {
  //     state.cb(cb)
  //   }
  // },
  // anime_prepare_item (state, index) {
  //   state.saved.items.forEach(item => { item.prepare = false })
  //   if (index !== undefined) state.saved.items[index].prepare = true
  // },
  // anime_remove_items (state, index) {
  //   state.saved.items[index].verify = !state.saved.items[index].verify
  // },
  // anime_folder (state, data) {
  //   state.saved.items[data.index].name = data.name
  // },
  // anime_selected (state, data) {
  //   state.saved.items[data.index].name_search = data.name
  // },
  // anime_anilist (state, data) {
  //   state.saved.items[data.index].anilist = data.id
  // },
  // anime_search (state, data) {
  //   state.saved.items[data.index].anime = data.item
  // },
  // anime_save (state, data) {
  //   state.saved.items[data.index].name = data.name
  //   state.saved.items[data.index].duplicate = data.duplicate
  //   state.saved.items[data.index].anime_id = data.id
  // },
  // anime_reset (state) {
  //   state.saved = null
  //   state.wait = false
  // }
}

export default {
  state,
  mutations
}
