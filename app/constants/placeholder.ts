import { IAnalysisUrl, TradeJournalEntry } from "@/app/types"


export const PLACEHOLDER_ANALYSIS = `# Market Analysis Summary

## Overall Market Bias
- **Neutral**: The chart displays a sequence of higher highs and higher lows, indicating some bullish momentum. 
- **Range-Bound**: Price has been oscillating within a defined range, suggesting indecision.
- **Volume**: Inconsistent volume spikes do not align with strong directional moves, contributing to a neutral bias.

## Support and Resistance

- **Key Support Levels**: 
  - **60,000** and **62,000**: Areas where the price has historically found demand.

- **Key Resistance Levels**: 
  - **70,000** and **72,000**: Levels where selling pressure has previously emerged.

- **Dynamic Behavior**: 
  - The price is currently testing the upper resistance level.
  - A breakout above resistance with strong volume could suggest a bullish trend; otherwise, continued range-bound behavior is likely.

## Patterns and Indicators

- **Patterns**: No clear chart patterns (e.g., head and shoulders, triangles) are evident, reinforcing the ranging market structure.
- **Indicators**: Lack of specific indicators on the chart makes it challenging to evaluate indicator quality or reliability.

## Trade Evaluation

- **Current Strategy**: Due to low-risk tolerance and neutral market conditions, there is no optimal trade setup.
- **Ranging Market**: Without a clear breakout or breakdown, the conditions are not favorable for a low-risk trade.

## Trade Execution Plan

- **Recommendation**: No trade execution plan is advised at this time. 
- **Actionable Triggers**: Wait for a breakout above resistance or a breakdown below support, confirmed by volume, before considering a trade.

## Summary

- **Entry Price**: N/A
- **Stop Loss**: N/A
- **Take Profit**: N/A
- **Expected Duration**: N/A
- **Re-Evaluation Conditions**: 
  - Re-evaluate the trade setup if the price breaks above **72,000** with strong volume.
  - Re-assess if the price falls below **60,000**, suggesting potential trend direction.
`

// export const PLACEHOLDER_ANALYSES = Array.from({length: 20}, (_, index)=> ({name: `analyses_${index}`, analyseUrl: `analyses_url_${index}`}) as IAnalysisUrl)