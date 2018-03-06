/*
* @Author: AlanWang
* @Date:   2018-03-06 09:52:30
* @Last Modified by:   AlanWang
* @Last Modified time: 2018-03-06 15:24:02
*/
const storage = window.localStorage

export default {
  saveScore (score) {
    storage.setItem(score.date, JSON.stringify(score))
  },
  getScores () {
    const scores = []
    try {
      for (let key in storage) {
        scores.push(JSON.parse(storage.getItem(key)))
      }
    } catch (error) {
      console.warn('Probably localStorage has not only score objects.\n' +
        'Delete non-JSON records in the localStorage to remove this warning.')
    }
    return scores
  }
}
