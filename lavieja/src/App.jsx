
import { useState } from 'react'
import confetti from 'canvas-confetti'

import './App.css'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkEndGame, checkWinner } from './logic/board'
import { Winner } from './components/Winner'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')

    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')

    return turnFromStorage ?? TURNS.x

  })
  const [winner, setWinner] = useState(null)

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;

    setTurn(newTurn)
    //*Guardar Partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinner(newBoard)

    if (newWinner) {
      setWinner(newWinner)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }

  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.x)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <>
      <main className='board'>
        <h1>Tic-Tac-Toe</h1>
        <button onClick={resetGame}>Reset del Juego</button>
        <section className='game'>
          {
            board.map((_, index) => {
              return (
                <Square index={index} key={index} updateBoard={updateBoard}>
                  {board[index]}
                </Square>
              )
            })
          }
        </section>

        <section className='turn'>
          <Square isSelected={turn === TURNS.x}>
            {TURNS.x}
          </Square>
          <Square isSelected={turn === TURNS.o}>
            {TURNS.o}
          </Square>
        </section>

        <Winner resetGame={resetGame} winner={winner} />
      </main>
    </>
  )
}

export default App
