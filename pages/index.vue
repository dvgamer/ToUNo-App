<template>
  <b-row>
    <b-col v-if="!$store.state.initApp" class="panel-center">
      <div class="preload-text">
        <i class="fas fa-circle-notch fa-spin" data-fa-transform="grow-6"></i>
        {{process}}
      </div>
    </b-col>
    <b-col v-else>
      <b-row>
        <b-col>
          <h3 style="padding:10px 0 12px 0">
            Overview <small class="text-muted">ANIME SEASON</small>
          </h3>
        </b-col>
      </b-row>
      <b-row style="padding-bottom:15px;">
        <b-col md="12">
          <b-card class="dashboard airing" bg-variant="warning" 
            text-variant="white" title="999 Airing">
            <p class="card-text">airing or waiting a subtitle file.</p>
          </b-card>
        </b-col>
        <b-col md="12">
          <b-card class="dashboard watched" bg-variant="info" 
            text-variant="white" title="999 Watched">
            <p class="card-text">watching and finished.</p>
          </b-card>
        </b-col>
        <b-col md="12">
          <b-card class="dashboard completed" bg-variant="success" 
            text-variant="white" title="999 Completed">
            <p class="card-text">finished and checked.</p>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="22">
          <b-card header="Summary">
            <p class="card-text">
              With supporting text below as a natural lead-in to additional content.
            </p>
          </b-card>
        </b-col>
        <b-col md="14">
          <b-card header="Card Title">
            <p class="card-text">
              With supporting text below as a natural lead-in to additional content.
            </p>
            <b-button href="#" variant="primary">Go somewhere</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>
<script>
  export default {
    data () {
      return {
        process: 'CHECK AUTH...'
      }
    },
    created () {
      console.log('Loading', this.$store.state.initApp)
      let vm = this
      this.$store.commit('setInitApp', true)
      // return axios({ method: 'post', url: '/anilist' }).then(res => {
      //   if (res.data.token) {
      //     return localforage.setItem('anilist-token', res.data).then(() => { return res.data })
      //   } else {
      //     // shell.openExternal('https://touno.co/auth/anilist')
      //     throw new Error(`RESTART NOW`)
      //   }
      // }).then(data => {
      //   console.log('Connecting... [SUCCESS]')
      //   vm.process = `UPDATE TOKEN...`
      // }).then(data => {
      //   store.commit('ONLINE', true)
      //   this.$router.push('dashboard')
      // }).catch(err => {
      //   console.log('Connecting... [FAIL]')
      //   vm.process = `OFFLINE MODE...`
      //   store.commit('ONLINE', false)
      //   this.$router.push('dashboard')
      //   vm.process = `${typeof err.response === 'object' ? `SERVER DOWN ${err.response.status}` : err}`
      // })
    }
  }
</script>

<style lang="scss">
  .panel-center {
    text-align: center;
    width: 500px;
    height: 160px;
    position: absolute;
    top: calc(50vh - 120px);
    left: calc(50vw - 250px);
  }
  img.logo {
    width: 450px;
  }
  .preload-text {
    font-size: 1.8rem;
    font-family: "Segoe UI";
    font-weight: bold;
    margin-top: 23px;
    color: #24688a;
  }
  .card.dashboard {
    .card-title {
      margin-bottom: 0.1rem;
    }
    .card-text {
      font-size: 0.8rem;
      > span + span {
        margin-left: 15px;
      }
    }
    > .card-body {
      background-size: 58px;
      background-repeat: no-repeat;
      padding-left: 100px;
    }

    &.airing > .card-body {
      background-position: 22px;
      background-image: url('~/assets/icon-airing.png');
    }
    &.watched > .card-body {
      background-position: 22px;
      background-image: url('~/assets/icon-watched.png');
      background-size: 82px;
      padding-left: 123px;
    }
    &.completed > .card-body {
      background-position: 19px;
      background-image: url('~/assets/icon-completed.png');
    }
  }
</style>

