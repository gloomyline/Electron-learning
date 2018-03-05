<template lang="pug">
  div(class='row')
    div(class='column game')
      div(class='greeting align-center' v-if='!gameStarted')
        h1 欢迎来到空间贪吃蛇游戏
        p 点击右侧按钮开始游戏吧！
      div(id='stage')
    div(class='column column-25 sidebar-wrapper')
      div(class='sidebar align-center align-items-center')
        h2 分数：
          span(id='score')
          button(@click='startGame') 开始
</template>

<script>
export default {
  name: 'game',
  data () {
    return {
      game: null,
      difficulty: 10,
      isPlaying: false,
      gameStarted: false,
      gamePaused: false,
      isLeftButtonPressed: false,
      isDownButtonPressed: false,
      isUpButtonPressed: false,
      isRightButtonPressed: false
    }
  },
  mounted () {},
  computed: {},
  methods: {
    startGame () {
      console.log('Game Started!')
    }
  },
  components: {}
}
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
</style>