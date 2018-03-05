<template lang="pug">
  div(id='app')
    topbar
    main
      transition(:name='transitionName' mode='out-in' appear)
        keep-alive
          router-view
</template>

<script>
  import Topbar from '@/components/Topbar/Topbar'

  export default {
    name: 'space-snake',
    computed: {
      transitionName () {
        return this.$route.path === '/'
          ? 'slide-right' : 'slide-left'
      }
    },
    components: {
      Topbar
    }
  }
</script>

<style lang="stylus">
  @import './styles/milligram.styl' /* import style file globally */

  main
    padding: 20px
    
  // Transitions
  .fade-enter-active, .fade-leave-active
    transition: opacity .2s
  .fade-enter, .fade-leave-to
    opacity: 0
  
  .slide-left-enter-active, .slide-right-enter-active
    transition: all .3s
  .slide-left-enter
    transform: translate3d(100px, 0, 0)
    opacity: 0
  .slide-right-enter
    transform: translate3d(-100px, 0, 0)
    opacity: 0
    
  // Animations
  @keyframes scale-in
    0%
      transform: scale(0)
    100%
      transform: scale(1)
  @keyframes scale-out
    0%
      transform: scale(1)
    100%
      transform: scale(0)
  .scale-enter-active
    animation: scale-in .3s
  .scale-leave-active
    animation: scale-out .3s 
</style>
