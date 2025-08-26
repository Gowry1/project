import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioData?: Uint8Array;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();

  // Generate random data for visualization when real data isn't available
  const generateRandomData = () => {
    const data = new Uint8Array(128);
    for (let i = 0; i < data.length; i++) {
      const baseline = Math.sin((i / data.length) * Math.PI) * 128;
      const randomFactor = Math.random() * 30;
      data[i] = Math.max(0, Math.min(255, baseline + randomFactor));
    }
    return data;
  };

  const drawVisualizer = (ctx: CanvasRenderingContext2D, audioData: Uint8Array) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Use gradient for a more professional look
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0A6EBD');
    gradient.addColorStop(1, '#17A2B8');
    ctx.fillStyle = gradient;
    
    const barWidth = width / audioData.length;
    
    for (let i = 0; i < audioData.length; i++) {
      const x = i * barWidth;
      const normalizedValue = audioData[i] / 255;
      const barHeight = normalizedValue * height;
      
      // Draw rounded bars
      const roundedHeight = Math.max(4, barHeight); // Minimum height of 4px
      ctx.beginPath();
      ctx.roundRect(
        x, 
        height - roundedHeight, 
        barWidth - 1, 
        roundedHeight, 
        [2, 2, 0, 0]
      );
      ctx.fill();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      // Use real audio data if available, otherwise generate random data
      const data = audioData || generateRandomData();
      drawVisualizer(ctx, data);
      
      if (isRecording) {
        requestIdRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isRecording) {
      animate();
    } else if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
      // Clear the canvas when not recording
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isRecording, audioData]);

  return (
    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        width={800}
        height={128}
      />
    </div>
  );
};

export default AudioVisualizer;