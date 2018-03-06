/*
* @Author: AlanWang
* @Date:   2018-03-06 09:39:56
* @Last Modified by:   AlanWang
* @Last Modified time: 2018-03-06 15:23:45
*/
import storage from '@/store/storage'
import * as types from '@/store/mutation-types'

const state = {
  scores: storage.getScores(),
  lastGame: {
    finished: false,
    score: 0
  },
  gameWon: false
}

const getters = {
  allScores: state => state.scores.concat().sort((scoreA, scoreB) => scoreB.score - scoreA.score),
  finishedGame: state => state.lastGame,
  gameWon: state => state.gameWon
}

const mutations = {
  [types.SAVE_SCORE] (state, score) {
    state.scores.push(score)
  },
  [types.TOGGLE_GAME] (state, lastGame) {
    state.lastGame.finished = lastGame.finished
    state.lastGame.score = lastGame.score
  },
  [types.WIN_GAME] (state, won) {
    state.gameWon = won
  }
}

const actions = {
  SAVE_SCORE ({ commit }, score) {
    storage.saveScore(score)
    commit(types.SAVE_SCORE, score)
  },
  TOGGLE_GAME ({ commit }, lastGame) {
    commit(types.TOGGLE_GAME, lastGame)
  },
  WIN_GAME ({ commit }, won) {
    commit(types.WIN_GAME, won)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
