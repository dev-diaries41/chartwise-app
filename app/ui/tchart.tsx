import React from 'react';

interface TradingChartProps {
  width: number;
  height: number;
  chartData: {
    lines: {
      x: number;
      y: number;
    }[];
    candlesticks: {
      x: number;
      y: number;
      open: number;
      high: number;
      low: number;
      close: number;
    }[];
  };
}

const TradingChart: React.FC<TradingChartProps> = ({ width, height, chartData }) => {
  return (
    <svg width={width} height={height}>
      {/* Chart background */}
      <rect x={50} y={50} width={width - 100} height={height - 100} fill="#f0f0f0" rx="10" />

      {/* Chart lines */}
      <g id="chart-lines">
        {chartData.lines.map((line, index) => (
          <path
            key={index}
            d={`M ${line.x} ${line.y} L ${line.x + 10} ${line.y - 10} L ${line.x + 20} ${line.y + 10} L ${line.x + 30} ${line.y}`}
            stroke="#666"
            stroke-width="2"
            fill="none"
          />
        ))}
      </g>

      {/* Candlesticks */}
      <g id="candlesticks">
        {chartData.candlesticks.map((candlestick, index) => (
          <g key={index} transform={`translate(${candlestick.x}, ${candlestick.y})`}>
            <rect
              x="-5"
              y="-20"
              width="10"
              height="40"
              fill="#ccc"
              rx="2"
            />
            <rect
              x="-5"
              y="20"
              width="10"
              height="40"
              fill="#ccc"
              rx="2"
            />
          </g>
        ))}
      </g>

      {/* Animations */}
      <animateTransform
        attributeName="transform"
        type="translate"
        from="0 0"
        to="10 10"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        dur="1s"
        repeatCount="indefinite"
      />

      {/* Decorations */}
      <circle cx={width / 2} cy={height / 2} r="10" fill="#fff" />
      <ellipse cx={width - 50} cy={height - 50} rx="15" ry="10" fill="#fff" />
    </svg>
  );
};

export default TradingChart;