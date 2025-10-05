'use client'

import { useState, useEffect } from 'react'
import { Chess, Square } from 'chess.js'

const ChessGame = () => {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([])

  const makeMove = (from: Square, to: Square) => {
    try {
      const move = game.move({ from, to, promotion: 'q' })
      if (move) {
        setGame(new Chess(game.fen()))
        setSelectedSquare(null)
        setPossibleMoves([])
      }
    } catch (error) {
      // Invalid move
    }
  }

  const handleSquareClick = (square: Square) => {
    if (selectedSquare === null) {
      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        const moves = game.moves({ square, verbose: true })
        setPossibleMoves(moves.map(move => move.to))
      }
    } else {
      if (square === selectedSquare) {
        setSelectedSquare(null)
        setPossibleMoves([])
      } else if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square)
      } else {
        // Select new square if it has a piece of the same color
        const piece = game.get(square)
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square)
          const moves = game.moves({ square, verbose: true })
          setPossibleMoves(moves.map(move => move.to))
        } else {
          setSelectedSquare(null)
          setPossibleMoves([])
        }
      }
    }
  }

  const renderSquare = (i: number, j: number) => {
    const square = (String.fromCharCode(97 + j) + (8 - i)) as Square
    const piece = game.get(square)
    const isLight = (i + j) % 2 === 0
    const isSelected = selectedSquare === square
    const isPossibleMove = possibleMoves.includes(square)

    return (
      <div
        key={square}
        className={`w-12 h-12 flex items-center justify-center cursor-pointer ${
          isLight ? 'bg-amber-100' : 'bg-amber-800'
        } ${isSelected ? 'ring-4 ring-blue-500' : ''} ${
          isPossibleMove ? 'ring-2 ring-green-500' : ''
        }`}
        onClick={() => handleSquareClick(square)}
      >
        {piece && (
          <span className="text-4xl">
            {getPieceSymbol(piece.type, piece.color)}
          </span>
        )}
      </div>
    )
  }

  const getPieceSymbol = (type: string, color: string) => {
    const symbols = {
      p: '♟',
      r: '♜',
      n: '♞',
      b: '♝',
      q: '♛',
      k: '♚',
    }
    return color === 'w' ? symbols[type as keyof typeof symbols] : symbols[type as keyof typeof symbols]?.toLowerCase()
  }

  const resetGame = () => {
    setGame(new Chess())
    setSelectedSquare(null)
    setPossibleMoves([])
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
      <div className="grid grid-cols-8 border-2 border-gray-800">
        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => renderSquare(i, j))
        )}
      </div>
      <div className="mt-4">
        <p className="text-lg">
          {game.in_checkmate()
            ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins`
            : game.in_draw()
            ? 'Draw'
            : game.in_check()
            ? `${game.turn() === 'w' ? 'White' : 'Black'} is in check`
            : `${game.turn() === 'w' ? 'White' : 'Black'} to move`}
        </p>
        <button
          onClick={resetGame}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ChessGame />
    </main>
  )
}