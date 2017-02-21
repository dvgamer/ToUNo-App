<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col class="demo-block demo-box" style="width:600px;">
        <div class="block">
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form label-position="top" label-width="100px">
                <el-form-item label="Name" prop="name">
                  <el-input placeholder="Item name" :autofocus="true" v-model="anime_name"></el-input>
                </el-form-item>
                <el-form-item label="Directory" prop="dir">
                  <el-input
                    placeholder="Path anime folder"
                    icon="upload2"
                    v-model="anime_source"
                    :on-icon-click="onBrowse">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button 
                    type="primary" 
                    @click="submit">Scan</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { ipcRenderer as ipc } from 'electron'
  import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  ipc.on('selected-anime', (e, path) => {
    store.commit('setSource', path[0])
  })
  ipc.on('list-anime', (e, anime) => {
    console.log('list-anime', anime)
    if (anime.found) {
      store.commit('setName', '')
      store.commit('setSource', '')
      axios({
        method: 'post',
        url: '/anime/saved',
        data: anime
      }).then(res => {

      })
    } else {

    }
  })

  export default {
    store,
    data () {
      return {
      }
    },
    computed: {
      anime_store () {
        return this.$store.getters.Anime
      },
      anime_name: {
        set (newValue) {
          this.$store.commit('setName', newValue)
        }
      },
      anime_source: {
        get () {
          return this.anime_store.source
        },
        set (newValue) {
          this.$store.commit('setSource', newValue)
        }
      }
    },
    methods: {
      submit () {
        let vm = this
        console.log(vm.anime_store)
        ipc.send('scan-anime', vm.anime_store)
      },
      onBrowse () {
        ipc.send('open-anime')
      }
    },
    created () {

    },
    destroyed () {
      this.$store.commit('setSource', '')
    }
  }
</script>

<style scoped>
  .demo-block {
    border: 1px solid #eaeefb;
    border-radius: 4px;
    transition: .2s;
  }
  .demo-block.demo-box > .block {
    padding: 30px 0;
  }
  .demo-block.demo-box:hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
  }
  .demo-box {
    margin-bottom: 24px;
  }
</style>
