import Vue from 'vue'
import Router from 'vue-router'

// components
import Game from '@/components/Game/Game.vue'
import Leaderboard from '@/components/Leaderboard/Leaderboard.vue'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'game',
      component: Game
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
