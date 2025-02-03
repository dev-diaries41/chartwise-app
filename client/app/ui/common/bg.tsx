import React from 'react';

interface BackgroundProps {
  className?: string;
}

export function Background ({ className }: BackgroundProps){
  const generateCirclePath = (cx: number, cy: number, r: number) => {
    return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 -${2 * r},0`;
  };

  return (
    <svg
      className={`${className} absolute top-0 left-0 w-full h-full opacity-10`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {[...Array(30)].map((_, i) => (
        <path
          key={i}
          d={generateCirclePath(Math.random() * 100, Math.random() * 100, Math.random() * 3)}
          fill="none"
          stroke="#4a5568"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
};


