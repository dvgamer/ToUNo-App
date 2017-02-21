const state = {
  new: {
    name: '',
    source: ''
  }
}

const mutations = {
  setSource (state, data) {
    state.new.source = data
  },
  setName (state, data) {
    state.new.name = data
  }
}

export default {
  state,
  mutations
}
