
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CanvasProps {
  color: string;
  lineWidth: number;
  backgroundColor: string;
}

export interface CanvasHandle {
  clear: () => void;
  getCanvas: () => HTMLCanvasElement | null;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ color, lineWidth, backgroundColor }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    const setCanvasDimensions = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (canvas.width !== width || canvas.height !== height) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            if(tempCtx) tempCtx.drawImage(canvas, 0, 0);
            
            canvas.width = width;
            canvas.height = height;
            
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
            if(tempCtx) context.drawImage(tempCanvas, 0, 0);
        }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    return () => {
        window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [backgroundColor]);
  
  useEffect(() => {
    if (contextRef.current) {
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);
  
  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    getCanvas: () => canvasRef.current,
  }));

  const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    } else {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const context = contextRef.current;
    if (!context) return;
    isDrawing.current = true;
    const { x, y } = getCoords(e.nativeEvent);
    context.beginPath();
    context.moveTo(x, y);
  };

  const finishDrawing = () => {
    const context = contextRef.current;
    if (!context) return;
    context.closePath();
    isDrawing.current = false;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const context = contextRef.current;
    if (!context) return;
    const { x, y } = getCoords(e.nativeEvent);
    context.lineTo(x, y);
    context.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchMove={draw}
      className="w-full h-full rounded-lg shadow-lg cursor-crosshair"
    />
  );
});

export default Canvas;
