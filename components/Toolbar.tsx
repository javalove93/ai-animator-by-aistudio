
import React from 'react';
import type { ToolOptions } from '../types';
import { PenIcon, EraserIcon, ClearIcon } from './icons';

interface ToolbarProps {
  toolOptions: ToolOptions;
  setToolOptions: React.Dispatch<React.SetStateAction<ToolOptions>>;
  onClear: () => void;
  canvasBackgroundColor: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ toolOptions, setToolOptions, onClear, canvasBackgroundColor }) => {
  const isEraser = toolOptions.color === canvasBackgroundColor;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolOptions(prev => ({ ...prev, color: e.target.value }));
  };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolOptions(prev => ({ ...prev, lineWidth: Number(e.target.value) }));
  };
    
  const setPen = () => {
    // A default color when switching from eraser. Pick black or last used color.
    setToolOptions(prev => ({ ...prev, color: '#000000' }));
  };

  const setEraser = () => {
    setToolOptions(prev => ({ ...prev, color: canvasBackgroundColor }));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-center text-cyan-400">그리기 도구</h3>
      <div className="flex justify-center space-x-2">
        <button onClick={setPen} className={`p-3 rounded-lg transition-colors ${!isEraser ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} title="펜">
            <PenIcon />
        </button>
        <button onClick={setEraser} className={`p-3 rounded-lg transition-colors ${isEraser ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} title="지우개">
            <EraserIcon />
        </button>
        <button onClick={onClear} className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors" title="모두 지우기">
            <ClearIcon />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <label htmlFor="color-picker" className="font-medium">색상:</label>
        <input
          id="color-picker"
          type="color"
          value={isEraser ? '#000000' : toolOptions.color}
          onChange={handleColorChange}
          className="w-10 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer disabled:opacity-50"
          disabled={isEraser}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="line-width" className="font-medium flex justify-between">
          <span>두께:</span>
          <span>{toolOptions.lineWidth}px</span>
        </label>
        <input
          id="line-width"
          type="range"
          min="1"
          max="50"
          value={toolOptions.lineWidth}
          onChange={handleLineWidthChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
    </div>
  );
};

export default Toolbar;
