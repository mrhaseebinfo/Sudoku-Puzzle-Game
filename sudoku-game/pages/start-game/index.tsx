import SudokuGame from '@/component/SudokuGame';
import React from 'react';


const StartGame: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SudokuGame />
    </div>
  );
};

export default StartGame;