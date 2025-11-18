
import React from 'react';
import { SpinnerIcon } from './icons';

interface ResultDisplayProps {
  imageSrc: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageSrc, isLoading, error }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-grow flex items-center justify-center min-h-[300px] lg:min-h-0">
      <div className="w-full h-full aspect-square flex items-center justify-center rounded-md bg-gray-900/50">
        {isLoading && (
          <div className="text-center">
            <SpinnerIcon className="w-16 h-16 mx-auto text-cyan-400" />
            <p className="mt-4 text-lg">AI가 이미지를 생성하고 있습니다...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center text-red-400 p-4">
            <h3 className="text-xl font-bold mb-2">오류 발생</h3>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && imageSrc && (
          <img src={imageSrc} alt="Generated result" className="object-contain w-full h-full rounded-md" />
        )}
        {!isLoading && !error && !imageSrc && (
          <div className="text-center text-gray-400">
            <h3 className="text-2xl font-semibold">결과 이미지</h3>
            <p className="mt-2">생성된 이미지가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
