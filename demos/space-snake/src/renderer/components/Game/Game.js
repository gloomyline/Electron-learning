/*
* @Author: AlanWang
* @Date:   2018-03-06 13:49:32
* @Last Modified by:   AlanWang
* @Last Modified time: 2018-03-06 15:06:45
*/
import store from '@/store'
const { floor, random } = Math

class Part {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Snake {
  constructor (game, x, y, segments) {
    this.game = game
    this.x = x
    this.y = y
    this.xspeed = 1
    this.yspeed = 0
    this.canChange = true
    this.parts = []

    for (let i = 0; i < segments; ++i) {
      this.parts.push(new Part(x - 1, y))
    }
  }

  controller (key) {
    if (key === 37 && this.yspeed !== 0 && this.canChange) {
      this.canChange = false
      this.xspeed = -1
      this.yspeed = 0
    }

    if (key === 39 && this.yspeed !== 0 && this.canChange) {
      this.canChange = false
      this.xspeed = 1
      this.yspeed = 0
    }

    if (key === 38 && this.xspeed !== 0 && this.canChange) {
      this.canChange = false
      this.xspeed = 0
      this.yspeed = -1
    }

    if (key === 40 && this.xspeed !== 0 && this.canChange) {
      this.canChange = false
      this.xspeed = 0
      this.yspeed = 1
    }
  }

  addPart () {
    const lastPart = this.parts[this.parts.length - 1]
    this.parts.push(new Part(lastPart.x, lastPart.y))
  }

  update () {
    this.x += this.xspeed
    this.y += this.yspeed

    this.x = this.x < 0
      ? 0 : this.x > (this.game.width - 1)
        ? (this.game.width - 1) : this.x

    this.y = this.y < 0
      ? 0 : this.y > (this.game.height - 1)
        ? (this.game.height - 1) : this.y

    for (let i = this.parts.length - 1; i >= 0; --i) {
      let part = this.parts[i]
      // After lose not to crash
      if (part !== undefined) {
        if (i !== 0) {
          part.x = this.parts[i - 1].x
          part.y = this.parts[i - 1].y

          if (this.x === part.x && this.y === part.y) {
            this.die()
          }
        } else {
          part.x = this.x
          part.y = this.y
        }

        // Determin the head of a snake
        const isFirstPart = this.x === this.parts[0].x && this.y === this.parts[0].y
        const isCurrentCellHead = (this.x === part.x && this.y === part.y)
        const isFirstCellHead = isFirstPart && isCurrentCellHead

        this.game.grid.fillGrid(part.x, part.y, false, isFirstCellHead)
      }
    }
    this.canChange = true
  }

  die () {
    stopSnake()

    const date = new Date()
    const lastScore = this.game.scoreValue

    finishGame({ finished: true, score: lastScore })
    saveScore(lastScore, date)
  }
}

class Food {
  constructor (game) {
    this.game = game
    this.isFood = true

    this.placeFood()
  }

  placeFood () {
    this.x = floor(random() * this.game.width)
    this.y = floor(random() * this.game.height)
  }

  update () {
    this.game.grid.fillGrid(this.x, this.y, this.isFood, false)
  }
}

class RenderGrid {
  constructor (game) {
    this.game = game
    this.grid = []

    this._buildGrid()
  }

  _buildGrid () {
    for (let x = 0; x < this.game.width; ++x) {
      this.grid[x] = []

      for (let y = 0; y < this.game.height; ++y) {
        let cell = document.createElement('div')
        // BackCell is for preventing buggy background when animating
        let backCell = document.createElement('div')

        backCell.classList.add('back-cell')
        backCell.style.width = backCell.style.height = this.game.size + 'px'
        backCell.style.left = x * this.game.size + 'px'
        backCell.style.top = y * this.game.size + 'px'

        cell.classList.add('cell')
        cell.style.width = cell.style.height = this.game.size + 'px'
        cell.style.left = x * this.game.size + 'px'
        cell.style.top = y * this.game.size + 'px'

        this.game.stage.appendChild(backCell)
        this.game.stage.appendChild(cell)

        this.grid[x][y] = {
          cell,
          value: false,
          isFood: false,
          isHead: false
        }
      }
    }
  }

  fillGrid (x, y, isFood, isHead) {
    if (this.grid[x]) {
      if (this.grid[x][y]) {
        this.grid[x][y].value = true
        this.grid[x][y].isFood = isFood
        this.grid[x][y].isHead = isHead
      }
    }
  }

  update () {
    for (let x = 0; x < this.game.width; ++x) {
      for (let y = 0; y < this.game.height; ++y) {
        let gridPiece = this.grid[x][y]
        // Empty or filled cell
        if (gridPiece.value) {
          gridPiece.cell.classList.add('filled')
          gridPiece.cell.classList.remove('empty')
        } else {
          gridPiece.cell.classList.add('empty')
          gridPiece.cell.classList.remove('filled')
        }
        // Is food or not
        if (gridPiece.isFood) {
          gridPiece.cell.classList.add('food')
        } else {
          gridPiece.cell.classList.remove('food')
        }
        // Is head or not
        if (gridPiece.isHead) {
          gridPiece.cell.classList.add('head')
        } else {
          gridPiece.cell.classList.remove('head')
        }
        gridPiece.value = false
      }
    }
  }
}

class Game {
  constructor (width, height, size, fps) {
    this.width = width
    this.height = height
    this.size = size
    this.fps = fps

    this.stage = document.querySelector('#stage')
    this.score = document.querySelector('#score')
    this.scoreValue = 0

    this.grid = new RenderGrid(this)
    this.food = new Food(this)
    this.snake = new Snake(this, 0, 0, 3)

    // Start Loop
    this.finishLoop()
    this.startLoop()
  }

  startLoop () {
    this.interVal = setInterval(() => {
      this.update()
    }, 1000 / this.fps)
    return true
  }

  finishLoop () {
    stopSnake()
    return false
  }

  update () {
    this.score.innerHTML = this.scoreValue

    this.food.update()
    this.snake.update()

    if (this.snake.x === this.food.x &&
      this.snake.y === this.food.y) {
      this.food.placeFood()
      this.snake.addPart()
      this.scoreValue++

      if (this.snake.parts.length === 576) {
        this.snake.die()
        winGame()
      }
    }

    this.grid.update()
  }
}

function stopSnake () {
  // Clear all Timeouts to stop the snake
  let id = window.setTimeout(null, 0)
  while (id--) {
    window.clearTimeout(id)
  }
}

function saveScore (score, date) {
  store.dispatch('SAVE_SCORE', { score, date })
}

function finishGame (lastGame) {
  store.dispatch('TOGGLE_GAME', lastGame)
}

function winGame () {
  store.dispatch('WIN_GAME', true)
}

export default Game
