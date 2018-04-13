<template>
  <b-row>
    <b-col>
      <b-breadcrumb :items="breadcrumb"/>
      <div style="text-align: center">
        <p>Hi from {{ name }}</p>
        <nuxt-link to="/">Back</nuxt-link>
      </div>
    </b-col>
  </b-row>

</template>

<script>
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  data () {
    return {
      breadcrumb: [
        {
          text: 'Anime',
          active: true
        }
      ]
    }
  }
}
</script>
