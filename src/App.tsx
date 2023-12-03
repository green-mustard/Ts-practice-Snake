import React, { useState, useEffect, useRef } from 'react'
import './App.css'

interface Point {
  x: number
  y: number
}

enum Direction {
  Up,
  Down,
  Left,
  Right
}

const GRID_SIZE = 20

const App: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [direction, setDirection] = useState<Direction>(Direction.Right)
  const [gameOver, setGameOver] = useState(false)

  const gameAreaRef = useRef<HTMLDivElement>(null)

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== Direction.Down) setDirection(Direction.Up)
        break
      case 'ArrowDown':
        if (direction !== Direction.Up) setDirection(Direction.Down)
        break
      case 'ArrowLeft':
        if (direction !== Direction.Right) setDirection(Direction.Left)
        break
      case 'ArrowRight':
        if (direction !== Direction.Left) setDirection(Direction.Right)
        break
      default:
        break
    }
  }

  const moveSnake = () => {
    if (gameOver) return

    const newSnake = [...snake]
    let newHead: Point = { x: snake[0].x, y: snake[0].y }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1
        break
      case Direction.Down:
        newHead.y += 1
        break
      case Direction.Left:
        newHead.x -= 1
        break
      case Direction.Right:
        newHead.x += 1
        break
      default:
        break
    }

    newSnake.unshift(newHead)

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFoodLocation(newSnake))
    } else {
      newSnake.pop()
    }

    if (checkCollision(newSnake)) {
      setGameOver(true)
    } else {
      setSnake(newSnake)
    }
  }

  const generateFoodLocation = (snake: Point[]): Point => {
    let newFood: Point
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y))
    return newFood
  }

  const checkCollision = (snake: Point[]): boolean => {
    const head = snake[0]
    return (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    )
  }

  useEffect(() => {
    const intervalId = setInterval(moveSnake, 200)
    return () => clearInterval(intervalId)
  }, [snake])

  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus()
    }
  }, [gameAreaRef])

  return (
    <div className="App">
      <div
        className="game-area"
        ref={gameAreaRef}
        tabIndex={0}
        onKeyDown={e => handleKeyPress(e)}
      >
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <div key={row} style={{ display: 'flex' }}>
            {Array.from({ length: GRID_SIZE }, (_, col) => (
              <div
                key={col}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: `#fff`,
                  border: '1px solid #ddd'
                }}
              >
                {snake.some(part => part.x === col && part.y === row) && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#333'
                    }}
                  />
                )}
                {food.x === col && food.y === row && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'red'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div>Game Over!</div>}
    </div>
  )
}

export default App
