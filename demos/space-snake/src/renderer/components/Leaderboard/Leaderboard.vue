<template lang="pug">
  transition(name='fade')
    div(class='leaderboard align-center')
      h1 排行榜
      table(v-if='allScores.length > 0')
        thead
          tr
            th #
            th 时间
            th 分数
        tbody
          tr(v-for='(scoreObj, index) in allScores' :key='index')
            td {{ index + 1 }}
            td {{ formattedDate(scoreObj.date) }}
            td {{ scoreObj.score }}
      h2(v-else) 暂无分数\n赶快去玩吧！
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'leaderboard',
  data () {
    return {}
  },
  mounted () {},
  computed: {
    ...mapGetters([
      'allScores'
    ])
  },
  methods: {
    formattedDate (dateString) {
      return new Date(dateString).toLocaleString()
    }
  },
  components: {}
}
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
  .leaderboard
    overflow: scroll
    max-height: 550px
    thead th
      text-align: center
    tbody
      td
        text-align: center
      td:last-child
        mixin-gradient-text($gradient-secondary)
        font-weight: 700
</style>