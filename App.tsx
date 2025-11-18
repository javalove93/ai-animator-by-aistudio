
import React, { useState, useRef, useCallback } from 'react';
import Canvas, { type CanvasHandle } from './components/Canvas';
import Toolbar from './components/Toolbar';
import ResultDisplay from './components/ResultDisplay';
import { generateAnimeImage } from './services/geminiService';
import type { ToolOptions } from './types';

const CANVAS_BACKGROUND_COLOR = '#FFFFFF';

const App: React.FC = () => {
  const [toolOptions, setToolOptions] = useState<ToolOptions>({
    color: '#000000',
    lineWidth: 5,
  });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<CanvasHandle>(null);

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  const handleGenerate = async () => {
    if (isLoading) return;
    
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) {
      setError('캔버스 요소를 찾을 수 없습니다.');
      return;
    }
    
    if (!prompt.trim()) {
      setError('이미지 생성을 위한 프롬프트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const drawingDataUrl = canvas.toDataURL('image/png');
      const resultImageUrl = await generateAnimeImage(drawingDataUrl, prompt);
      setGeneratedImage(resultImageUrl);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
            AI 애니메이터
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            당신의 스케치를 멋진 애니메이션 아트로 변환해보세요
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Drawing Area */}
          <div className="flex flex-col gap-4">
            <Toolbar 
              toolOptions={toolOptions}
              setToolOptions={setToolOptions}
              onClear={handleClear}
              canvasBackgroundColor={CANVAS_BACKGROUND_COLOR}
            />
            <div className="aspect-square bg-white rounded-lg shadow-2xl overflow-hidden">
              <Canvas 
                ref={canvasRef} 
                color={toolOptions.color}
                lineWidth={toolOptions.lineWidth}
                backgroundColor={CANVAS_BACKGROUND_COLOR}
              />
            </div>
          </div>

          {/* Right Column: Controls and Result */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-cyan-400">프롬프트 입력</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: '은하수를 배경으로 한 마법 소녀'"
                className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                rows={4}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 text-lg"
              >
                {isLoading ? '생성 중...' : '이미지 생성하기'}
              </button>
            </div>
            <ResultDisplay 
              imageSrc={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
