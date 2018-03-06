<template lang="pug">
  div(id='topbar' class='shadow')
    div(class='row')
      div(class='column')
        div(class='logo')
          img(src='./assets/icon.png')
      div(class='column align-right')
        router-link(to='/' exact) 游戏
        router-link(to='/leaderboard') 排行榜
</template>

<script>
export default {
  name: 'topbar',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  methods: {},
  components: {}
}
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
#topbar
  background-color: #fff
  padding: 20px
  .row
    .column
      .logo
        img
          display: block
          width: 25px
          margin-left: 5px
          transform: scale(1.7)
          transition: all .3s
      a
        display: inline-block
        margin-left: 20px
        color: $color-dark
        &:active, &.router-link-active
          mixin-gradient-text($gradient-secondary)
</style>