import React, { useState, useEffect, useCallback } from 'react';

// Type definitions
type CellValue = number;
type Grid = CellValue[][];
type GridMask = boolean[][]; // true for initial/pre-filled cells
type CellPosition = { row: number; col: number } | null;

// Constants
const GRID_SIZE = 9;
const BOX_SIZE = 3;
const EMPTY_CELL: CellValue = 0;
const DIFFICULTY = 40; // Number of cells to remove

const SudokuGame: React.FC = () => {
  // State
  const [grid, setGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<GridMask>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  // Utility functions
  const createEmptyGrid = (): Grid => {
    return Array(GRID_SIZE).fill(EMPTY_CELL).map(() => Array(GRID_SIZE).fill(EMPTY_CELL));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Sudoku validation and solving algorithms
  const isValidPlacement = useCallback((board: Grid, row: number, col: number, num: CellValue): boolean => {
    // Check row
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % BOX_SIZE);
    const startCol = col - (col % BOX_SIZE);

    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }, []);

  const solveSudoku = useCallback((board: Grid): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col] === EMPTY_CELL) {
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          for (const num of numbers) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;

              if (solveSudoku(board)) return true;

              board[row][col] = EMPTY_CELL;
            }
          }
          return false;
        }
      }
    }
    return true;
  }, [isValidPlacement]);

  const removeNumbers = useCallback((board: Grid, count: number): void => {
    let removed = 0;

    while (removed < count) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (board[row][col] !== EMPTY_CELL) {
        board[row][col] = EMPTY_CELL;
        removed++;
      }
    }
  }, []);

  // Game logic
  const generateSudoku = useCallback((): void => {
    const emptyGrid = createEmptyGrid();
    const workingGrid = emptyGrid.map(row => [...row]) as Grid;

    // Generate a complete solution
    if (!solveSudoku(workingGrid)) {
      console.error('Failed to generate Sudoku solution');
      return;
    }

    const solvedGrid = workingGrid.map(row => [...row]) as Grid;
    const puzzleGrid = solvedGrid.map(row => [...row]) as Grid;

    // Create puzzle by removing numbers
    removeNumbers(puzzleGrid, DIFFICULTY);

    // Create mask for initial cells (non-empty cells)
    const initialMask: GridMask = puzzleGrid.map(row =>
      row.map(cell => cell !== EMPTY_CELL)
    );

    setGrid(puzzleGrid);
    setSolution(solvedGrid);
    setInitialGrid(initialMask);
    setGameCompleted(false);
    setMistakes(0);
    setSelectedCell(null);
    setMessage('');
  }, [solveSudoku, removeNumbers]);

  const checkGameCompletion = useCallback((currentGrid: Grid): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }

    setGameCompleted(true);
    setMessage('Congratulations! You solved the puzzle! 🎉');
    return true;
  }, [solution]);

  const handleCellClick = useCallback((row: number, col: number): void => {
    if (!initialGrid[row]?.[col]) {
      setSelectedCell({ row, col });
    }
  }, [initialGrid]);

  const handleNumberInput = useCallback((num: CellValue): void => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (!initialGrid[row]?.[col]) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = num;
      setGrid(newGrid);

      // Validate input
      if (num !== solution[row][col]) {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        setMessage(`Incorrect number! ${3 - newMistakes} attempts remaining.`);
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Correct! ✅');
        setTimeout(() => setMessage(''), 1000);
        checkGameCompletion(newGrid);
      }
    }
  }, [selectedCell, initialGrid, grid, solution, mistakes, checkGameCompletion]);

  const handleClearCell = useCallback((): void => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (!initialGrid[row]?.[col]) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = EMPTY_CELL;
      setGrid(newGrid);
    }
  }, [selectedCell, initialGrid, grid]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (!selectedCell) return;

      const key = e.key;

      if (key >= '1' && key <= '9') {
        handleNumberInput(parseInt(key, 10));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        handleClearCell();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, handleNumberInput, handleClearCell]);

  // Initialize game
  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  // Component rendering functions
  const renderGrid = (): any => {
    if (!grid.length) return <div>Loading...</div>;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-800">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isInitial = initialGrid[rowIndex]?.[colIndex];
              const isWrong = cell !== EMPTY_CELL && cell !== solution[rowIndex]?.[colIndex];

              // Border styling for 3x3 boxes
              const borderClass = `
                ${rowIndex % BOX_SIZE === 0 && rowIndex !== 0 ? 'border-t-2 border-gray-800' : ''}
                ${colIndex % BOX_SIZE === 0 && colIndex !== 0 ? 'border-l-2 border-gray-800' : ''}
              `;

              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    border border-gray-300 cursor-pointer select-none
                    transition-all duration-200 text-lg font-medium
                    ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 z-10' : 'bg-white'}
                    ${isInitial ? 'font-bold text-gray-900' : 'text-blue-700'}
                    ${isWrong ? 'bg-red-100 text-red-600' : ''}
                    ${borderClass}
                    hover:bg-gray-50 active:bg-gray-100
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1} - ${cell || 'empty'}${isInitial ? ' (pre-filled)' : ''}`}
                >
                  {cell !== EMPTY_CELL ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderNumberPad = (): any => (
    <div className="">
      <button
        className="w-40 py-4 text-white bg-red-500 rounded-lg font-semibold"
        onClick={handleClearCell}
        aria-label="Clear cell"
      >
        Clear
      </button>
    </div>
  );

  const renderGameStatus = (): any => (
    <div className="flex justify-between items-center mb-6">
      <div className="bg-white rounded-lg px-4 py-3 shadow border">
        <span className="text-sm text-gray-600 font-medium">Mistakes: </span>
        <span className={`font-bold ${mistakes >= 3 ? 'text-red-600' : 'text-gray-800'}`}>
          {mistakes}/3
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => generateSudoku()}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold
                   hover:bg-green-600 active:bg-green-700 transition-colors duration-200
                   active:scale-95 shadow-md"
          aria-label="Generate new game"
        >
          New Game
        </button>
      </div>
    </div>
  );

  const renderMessage = (): any | null => {
    if (!message) return null;

    const messageType = message.includes('Congratulations') ? 'success' :
      message.includes('Incorrect') ? 'error' : 'info';

    const styles = {
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <div className={`mb-4 p-3 rounded-lg text-center font-semibold border ${styles[messageType]}`}>
        {message}
      </div>
    );
  };

  const renderCompletionModal = (): any | null => {
    if (!gameCompleted) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">Puzzle Solved!</h2>
          <p className="text-gray-700 mb-6">
            You completed the Sudoku with {mistakes} mistake{mistakes !== 1 ? 's' : ''}!
          </p>
          <button
            onClick={generateSudoku}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold
                     hover:bg-green-600 active:bg-green-700 transition-colors duration-200
                     w-full shadow-md"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Sudoku
          </h1>
          <p className="text-gray-600 font-medium">Logical number puzzle</p>
        </header>

        {/* Game Status */}
        {renderGameStatus()}

        {/* Message Display */}
        {renderMessage()}

        {/* Game Grid */}
        <div className="flex justify-center mb-6">
          {renderGrid()}
        </div>

        {/* Controls */}
        <section className="text-center mb-8">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              Select a cell and enter a number (1-9)
            </p>

          </div>

          {renderNumberPad()}
        </section>
        {/* Game Completion Modal */}
        {renderCompletionModal()}
      </div>
    </div>
  );
};

export default SudokuGame;