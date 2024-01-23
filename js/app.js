class Game {
    constructor() {
        // colors
        this.boardBorder = '#000000',
        this.boardBg = '#ffffff',
        this.snakeColor = '#cfb87c',
        this.snakeBorder = '#000000',

        // Snake body
        // an array of objects
        // each object has x, y coordinates
        this.snake = [
            {x: 200, y: 200}, // snake head
            {x: 190, y: 200},
            {x: 180, y: 200},
            {x: 170, y: 200},
            {x: 160, y: 200}
        ],

        // get access to canvas
        this.snakeBoard = document.getElementById('snakeBoard'),
        this.snakeBoardCtx = this.snakeBoard.getContext('2d') // sets the context to 2d

        // controls the direction
        this.dx = 10
        this.dy = 0

        this.changingDirection = false;

        // set the speed in milliseconds
        this.speed = 200

        // food
        this.foodX = 0
        this.foodY = 0

        // score
        this.score = {
            currentScore : 0,
            previousScore : 0,
            highScore : 0
        }
    }

    startGame() {
        this.snake = [
            {x: 200, y: 200}, // snake head
            {x: 190, y: 200},
            {x: 180, y: 200},
            {x: 170, y: 200},
            {x: 160, y: 200}
        ]

        this.dx = 10
        this.dy = 0

        this.speed = 200

        this.foodX = 0
        this.foodY = 0
        
        this.score = {
            currentScore: 0,
            previousScore: this.score.previousScore,
            highScore: this.score.highScore
        }

        snake.init()
        snake.generateFood()
    }
    
    init() {
        if (this.hasGameEnded()) {
            this.setPreviousScore()
        } 
        
        // reset the changeDirection to false
        this.changingDirection = false

        // set a timer to redraw the vanvas and its elements
        setTimeout(() => {
            this.createCanvas()
            this.drawSnake()
            this.drawFood()
            this.moveSnake()

            // call init as a recursive function
            this.init()
        }, this.speed)
    }

    // create canvas (Herb named it makeCanvas)
    createCanvas() {
        const snakeBoard = this.snakeBoard
        const snakeBoardCtx = this.snakeBoardCtx

        // apply the color to the canvas and apply the strokeStyle to the border
        // apply the fill color to the snake
        snakeBoardCtx.fillStyle = this.boardBg
        snakeBoardCtx.strokeStyle = this.boardBorder
        snakeBoardCtx.fillRect(0, 0, snakeBoard.width, snakeBoard.height)
        snakeBoardCtx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height)
    }

    // 2 draw snake
    drawSnake() {
        const snake = this.snake
        const snakeBoardCtx = this.snakeBoardCtx // need context to paint on the canvas

        // Loop through the array of objects and paint the snake
        snake.forEach(snakePart => {
            snakeBoardCtx.fillStyle = this.snakeColor
            snakeBoardCtx.strokeStyle = this.snakeBorder
            snakeBoardCtx.fillRect(snakePart.x, snakePart.y, 10, 10)
            snakeBoardCtx.strokeRect(snakePart.x, snakePart.y, 10, 10)
        })
    }

    // 3 Move snake
    moveSnake() {
        const snake = this.snake
        // const snakeBoardCtx = this.snakeBoardCtx 
        // set the initial position of the head
        const head = {x: snake[0].x + this.dx, y: snake[0].y + this.dy }
        snake.unshift(head)// adds array element to the beginning of the array

        // 7 when snake eats food; snake has collided with food; food becomes the head of the snake
        const hasEaten = snake[0].x === this.foodX && snake[0].y === this.foodY

        if (hasEaten) {
            this.score.currentScore += 10
            this.setScores()

            this.speed -= 5 // when snake eats, its speed increases
            const displayScore = document.getElementById('score')
            displayScore.innerText = this.score.currentScore
            this.generateFood()
        } else {
            // moved the snake.pop into the else block
            snake.pop() // removes the last array element
        }

    }

    setScores() {
        const highScoreDisplay = document.getElementById('highScore')
        
        if (this.score.currentScore > this.score.highScore) {
            this.score.highScore = this.score.currentScore
        }
        
        highScoreDisplay.innerText = this.score.highScore
    }
    
    setPreviousScore() {
        const previousScoreDisplay = document.getElementById('previousScore')
        if (this.hasGameEnded()) {
            this.score.previousScore = this.score.currentScore
            previousScoreDisplay.innerText = this.score.previousScore
        }
    }

    // 4 change the direction
    changeDirection(e) {
        const LEFT = 37 // keyboard numbers for arrows
        const RIGHT = 39
        const UP = 38
        const DOWN = 40

        if (this.changingDirection) return
            this.changingDirection = true

        const keyPressed = e.keyCode    
        // evaluates to true/false depending on this.dx or this.dy
        const goingUp = this.dy === -10 
        const goingDown = this.dy === 10 
        const goingRight = this.dx === 10
        const goingLeft = this.dx === -10

        if (keyPressed === LEFT && !goingRight) {
            this.dx = -10
            this.dy = 0
        } else if (keyPressed === UP && !goingDown) {
            this.dx = 0
            this.dy = -10
        } else if (keyPressed === RIGHT && !goingLeft) {
            this.dx = 10
            this.dy = 0
        } else if (keyPressed === DOWN && !goingUp) {
            this.dx = 0
            this.dy = 10
        }
    }

    // 8 hasGameEnded returns boolean
    hasGameEnded() {
        const snake = this.snake
        const snakeBoard = this.snakeBoard

        for (let i = 4; i < snake.length; i++) {
            // snake has collided with itself
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
        }

        // snake has hit a wall
        const hitLeftWall = snake[0].x < 0
        const hitRightWall = snake[0].x > snakeBoard.width - 10
        const hitTopWall = snake[0].y < 0
        const hitBottomWall = snake[0].y > snakeBoard.height - 10

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
    }

    // 5 Draw food

    drawFood() {
        this.snakeBoardCtx.fillStyle = 'brown'
        this.snakeBoardCtx.strokeStyle = 'limegreen'
        this.snakeBoardCtx.fillRect(this.foodX, this.foodY, 10, 10)
        this.snakeBoardCtx.strokeRect(this.foodX, this.foodY, 10, 10)
    }

    randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10
    }

    // 6  generate food
    // the food must be inside the snakeBoard; must be inside the 390 limit
    generateFood() {
        this.foodX = this.randomFood(0, this.snakeBoard.width - 10)
        this.foodY = this.randomFood(0, this.snakeBoard.height - 10)
        // first part of the collision, when two objects touch
        // the coordinates for the food and the snake are the same
        this.snake.forEach(part => {
            const hasEaten = part.x === this.foodX && part.y === this.foodY

            if (hasEaten) {
                this.generateFood()
            } 
            // hasEaten ? this.generateFood() : null
        })
    }
}

const snake = new Game()

const gameBtn = document.getElementById('gameBtn')
gameBtn.addEventListener('click', ()=> {
    snake.startGame()
} )



// snake.init()

document.addEventListener('keydown', ()=> {
    snake.changeDirection(event)
})

snake.generateFood()