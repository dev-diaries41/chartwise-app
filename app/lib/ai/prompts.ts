import { AnalysisParams } from "@/app/types";

function getRiskTolerance (risk?:number) {
  if(!risk || isNaN(risk))return null;
  switch(true){
    case risk <= 0.33 * 100:
      return 'Low risk';
    case risk <= 0.66 * 100 && risk > 0.33 * 100:
      return 'Med risk';
    case risk > 0.66 * 100:
      return 'High risk';
    default:
      return 'Low risk';
  }
}

const TASK_MESSAGE = `Please provide the following details based on your analysis of the chart and expert trading knowledge:`
const TASK_MESSAGE_SAC = `Strongly considering the trader's strategy, please provide the following details based on your analysis of the chart and expert trading knowledge:`

export const chartAnalysisPrompt = (metadata: AnalysisParams['metadata'], isMultiChart: boolean = false): string => {
  const { strategyAndCriteria, risk } = metadata || {};

  return`
  Meticulously analyze the ${isMultiChart ? 'provided charts which show the same asset in different timeframes. Please pay close attention to each timeframe individually, while being clear about which timeframe is most relevant for the current analysis and why. The larger timeframe may hold more weight in terms of trend direction, but smaller timeframes may reveal key entry points or short-term patterns.' : 'chart'} - pay close attention to the candlesticks, price action, anomalous price changes, and indicators, while referencing your expert knowledge on the asset being traded.

  ${(strategyAndCriteria || risk) ? `**Trader's strategy: ${strategyAndCriteria ?? ''}\n${risk? `Risk tolerance: ${getRiskTolerance(risk)}` : ''}**` : ''}

  ${strategyAndCriteria ? TASK_MESSAGE_SAC : TASK_MESSAGE}

  ## Key Takeaways

  ### Overall Market Bias
  **Bullish**, **Bearish**, or **Neutral** — Describe the key factors leading to this bias, including overall trend direction, volume behavior, and significant price action. ${isMultiChart? 'Explain how the timeframes align or differ, and which timeframe holds more weight for the bias.': ''}

  ### Support and Resistance
  - **Key Support Levels**: Identify the price levels where the asset has historically found demand.
  - **Key Resistance Levels**: Identify where selling pressure has previously emerged.
  - **Dynamic Behavior**: Explain how price is behaving relative to these levels (e.g., are they holding, or is the price moving through them?).

  ### Patterns and Indicators
  - Identify any patterns (e.g., head and shoulders, triangles, flags etc) and discuss how the current price action aligns with these patterns.
  - Assess the **quality** and **reliability** of technical indicators, only if present on the chart.

  ## Trade Evaluation
  Evaluate if there's an optimal profitable trade setup with a clear bias, matching the provided <Trader's strategy> (if provided) and <Risk tolerance>. If the setup doesn’t align with the strategy or risk tolerance, provide an objective assessment of whether the market conditions are still favorable for a trade.

  - If the criteria includes a risk to reward ratio, do not artificially create the ratio by setting unrealistic take profits or stop losses.
  - If you cannot identify any trade setups in the ${isMultiChart ? 'charts' : 'chart'}, inform the trader accordingly and end the analysis here.

  ## Trade Execution Plan
  Consider the overall risk-reward potential and provide recommendations based on an analysis of volatility, asset behavior, and broader market conditions. Ensure the trade fits the **probability of success**.

  - **Entry Triggers**: Be specific about price action to look for before entering (e.g., candlestick patterns, support/resistance pullbacks, or breakouts). Explain why the entry point is chosen.
  - **Multiple Entries/Scaling**: If applicable, suggest multiple entry points or scaling into the trade, explaining how this can reduce risk or improve profit potential.
  - **Volatility Adjustments**: Adjust stop losses and take profits based on **average volatility** and historical price swings.
  - **Dynamic Stop Loss**: If the trade becomes profitable, when and how would you suggest adjusting the stop loss to break-even or closer to the market price?
  - **Confirmation from Indicators**: Assess the quality of any confirming signals from additional indicators, and whether they support or contradict the trade, only if present on the chart(s).

  Once all factors are considered, provide clear parameters for the trade:

  - Entry price: [Recommended entry price(s)]
  - Stop Loss price: [Recommended stop loss price(s)]
  - Take Profit price: [Recommended take profit price(s)]

  ## Summary
  - **Entry price:** [Entry Price]
  - **Stop Loss price:** [Stop Loss Price]
  - **Take Profit price:** First: [Take Profit price]
  - **Expected Duration:** [Expected Duration] (a range in hours, days or weeks)
  - **Conditions in which to re-evaluate the trade setup:** [Conditions to Re-evaluate]

  **Important: IF THE IMAGE IS NOT A CHART, inform the trader that they need to provide a chart before you can begin analysis**
  `;
};

export function recentPriceDataPrompt(priceData: string){
  `**Price data**:\n${priceData}
  
  Use the price data above along with the chart images to provide the analysis
  `
}
