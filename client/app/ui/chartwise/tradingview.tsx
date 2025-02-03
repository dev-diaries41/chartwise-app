'use client'
import React, { useEffect, useRef, memo } from 'react';

export default React.memo(function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null); // Correct ref type for the container

  

  useEffect(() => {
    // Ensure the script is appended only if it does not already exist
    const getTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      } else {
        return 'light'; // Fallback to light if no preference is found
      }
    };
    if (!container.current?.querySelector('script')) {
      const script = document.createElement("script");
      const theme = getTheme();  // Detect the theme

      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "${theme}",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

      container.current?.appendChild(script);
    }
  }, []);

  return (
    <div className="absolute top-0 bottom-0 min-h-screen max-w-screen tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      {/* <div className="tradingview-widget-container__widget bg-white" style={{ height: "calc(100% - 32px)", width: "100%", background:'#fff' }}></div> */}
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
})

