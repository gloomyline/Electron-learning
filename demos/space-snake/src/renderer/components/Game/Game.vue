<template lang="pug">
  div(class='row')
    div(class='column game')
      div(class='greeting align-center' v-if='!gameStarted')
        h1 欢迎来到空间贪吃蛇游戏
        p 点击右侧按钮开始游戏吧！

      div(id='stage')

      transition(name='fade')
        div(class='finished-game-popup shadow align-center' v-if='gamePaused')
          h4 游戏暂停
        div(class='finished-game-popup shadow align-center' v-if='finishedGame.finished')
          h4 游戏结束
          p 你的分数为
            span {{ finishedGame.score }}
        div(class='finished-game-popup shadow align-center' v-if='gameWon')
          h4 你赢了！
          p 恭喜你
          p 你的分数为
            span {{ finishedGame.score }}

    div(class='column column-25 sidebar-wrapper')
      div(class='sidebar align-center align-items-center')
        h2 分数
          span(id='score')

        button(@click='startGame') 开始
        transition(name='scale')
          div(v-if='gameStarted && !finishedGame.finished')
            button(@click='pauseGame' v-if='isPlaying') 暂停
            button(@click='resumeGame' v-if='!isPlaying') 继续

        h2 设置
        label(for='difficulty') 难度 {{ difficulty }}
        input(id='difficulty' type='range' min='5' max='50' v-model='difficulty')

        h2 控制
        p(class='instruction') 使用箭头按钮或者键盘上的方向按键控制蛇的方向
        div(class='controls')
          div(class='row')
            div(class='column')
              img(
                src='./assets/Up.png'
                :class='{ pressed: isUpButtonPressed }'
                @click='buttonPressed(38)'
              )
          div(class='row')
            div(class='column')
              img(
                src='./assets/Left.png'
                :class='{ pressed: isLeftButtonPressed }'
                @click='buttonPressed(37)'
              )
              img(
                src='./assets/Down.png'
                :class='{ pressed: isDownButtonPressed }'
                @click='buttonPressed(40)'
              )
              img(
                src='./assets/Right.png'
                :class='{ pressed: isRightButtonPressed }'
                @click='buttonPressed(39)'
              )
</template>

<script>
import { mapGetters } from 'vuex'
import Game from './Game.js'

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
  created () {
    window.addEventListener('keydown', e => {
      this.buttonPressed(e.keyCode)
    })
  },
  computed: {
    ...mapGetters([
      'finishedGame',
      'gameWon'
    ])
  },
  methods: {
    startGame () {
      this.removePreviousCells()

      this.game = new Game(24, 24, 24, this.difficulty)

      this.gameStarted = true
      this.isPlaying = true
      this.gamePaused = false

      this.$store.dispatch('TOGGLE_GAME', {
        finished: false,
        score: 0
      })
      this.$store.dispatch('WIN_GAME', false)
    },
    pauseGame () {
      this.isPlaying = this.game.finishLoop()
      this.gamePaused = true
    },
    resumeGame () {
      this.isPlaying = this.game.startLoop()
      this.gamePaused = false
    },
    buttonPressed (key) {
      // Control snake if game started
      if (this.gameStarted) {
        this.game.snake.controller(key)
      }

      let button = ''

      switch (key) {
        case 37:
          button = 'Left'
          break
        case 38:
          button = 'Up'
          break
        case 39:
          button = 'Right'
          break
        case 40:
          button = 'Down'
          break
      }
      // Button animation
      this[`is${button}ButtonPressed`] = true
      setTimeout(() => {
        this[`is${button}ButtonPressed`] = false
      }, 200)
    },
    removePreviousCells () {
      if (this.game !== null) {
        const stage = this.game.stage

        while (stage.hasChildNodes()) {
          stage.removeChild(stage.lastChild)
        }
      }
    }
  }
}
</script>

<style lang="stylus" ref="stylesheet/stylus">
  .game
    position: relative
    .greeting
      margin-top: 200px
    #stage
      position: relative
      margin: 0 auto
      .cell
        position: absolute
        transition: all .1s
        background-color: #fff
        &.filled
          mixin-cell-image('./assets/Clone.png')
          transform: scale($scale-coef)
          &.food
            mixin-cell-image('./assets/Planet-2.png')
            transform: scale(1)
          &.head
            mixin-cell-image('./assets/Darth-Vader.png')
            transform: scale(1)
        // &.empty
      .back-cell
        /* need nested selectors here */
        @extend .game #stage .cell
    .finished-game-popup
      position: absolute
      top: 230px
      left: 298px
      margin: 0 auto
      padding: 20px
      background-color: #fff
      transform: translate3d(-50%, 0, 0)
      z-index: 2
      h4, p
        margin-bottom: 0
        span
          mixin-gradient-text($gradient-secondary)
          font-weight: 700
          font-size: 20px
  .column.sidebar-wrapper
    padding-left: 20px
    .sidebar
      height: 100%
      button:active
        transform: scale($scale-coef)
        background: $gradient-secondary
      h2
        margin: 40px 0 10px
        &:first-child
          margin-top: 0
      input[type="range"]
        margin-bottom: 0
      .instruction
        margin-bottom: 10px
      .controls
        img
          display: inline-block
          width: 38px
          margin-right: 7px
          padding: 7px
          background: $gradient-primary
          border-radius: $radius-primary
          transition: $transition-primary
          cursor: pointer
          &:last-child
            margin: 0
          &.pressed
            transform: scale($scale-coef)
            background: $gradient-secondary
</style>