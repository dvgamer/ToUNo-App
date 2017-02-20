<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col class="demo-block demo-box" style="width:600px;">
        <div class="block">
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form label-position="top" label-width="100px" :model="anime">
                <el-form-item label="Name">
                  <el-input placeholder="Item name" v-model="anime.name"></el-input>
                </el-form-item>
                <el-form-item label="Directory">
                  <el-input
                    placeholder="Path anime folder"
                    icon="upload2"
                    :autofocus="true"
                    v-model="anime.source"
                    :on-icon-click="onBrowse">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm">Scan </el-button>
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

  export default {
    data () {
      return {
        anime: {
          name: '',
          source: ''
        }
      }
    },
    methods: {
      submitForm () {
        let vm = this
        ipc.send('scan-anime', vm.anime)
      },
      onBrowse () {
        ipc.send('open-anime')
      }
    },
    created () {
      let vm = this
      ipc.on('selected-anime', function (e, path) {
        vm.anime.source = path[0]
      })
      ipc.on('list-anime', function (e, items) {
        axios({
          url: '/anime/saved',
          data: vm.anime
        }).then(res => {

        })
      })
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
