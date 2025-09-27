import { useRouter } from "next/router";
import { useState } from "react";


export default function Home() {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <header className="w-full flex justify-center items-center py-6">
          <h1 className="flex item-center items-center text-3xl md:text-4xl font-bold text-indigo-800">Sudoku  Master</h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl my-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 items-center justify-center flex">Challenge Your Mind</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Multiple Difficulty Levels</h3>
                  <p className="text-sm text-gray-600">From beginner to expert</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Track Your Progress</h3>
                  <p className="text-sm text-black">Complete puzzles faster each time</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Hint System</h3>
                  <p className="text-sm text-gray-600">Get help when you're stuck</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors" onClick={() => router.push('/start-game')}>
                New Game
              </button>
              <button className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 py-3 px-4 rounded-lg font-medium transition-colors" onClick={() => setIsOpen(true)}>
                How to Play
              </button>
            </div>
          </div>
        </main>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg font-medium"
        >
          How to Play Sudoku
        </button>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">How to Play Sudoku</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Sudoku is played on a 9×9 grid, divided into nine 3×3 blocks.</p>
                  <p><strong>Objective:</strong> Fill each row, column, and 3×3 block with the numbers 1-9 exactly once.</p>
                  <p><strong>Rules:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Each row must contain all digits from 1 to 9 without repetition</li>
                    <li>Each column must contain all digits from 1 to 9 without repetition</li>
                    <li>Each 3×3 box must contain all digits from 1 to 9 without repetition</li>
                  </ul>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}