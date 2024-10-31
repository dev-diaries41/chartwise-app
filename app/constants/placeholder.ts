import { IAnalysisUrl, TradeJournalEntry } from "@/app/types"


export const PLACEHOLDER_ANALYSIS = `## Key Takeaways

### Overall Market Bias
**Neutral to Bearish**

- **Trend Direction**: The chart shows a series of lower highs and lower lows, indicating a potential downtrend.
- **Volume Behavior**: Volume spikes are noticeable during price declines, suggesting stronger selling pressure.
- **Significant Price Action**: Recent candlesticks show bearish momentum with long red bodies, indicating strong selling.

### Support and Resistance
- **Key Support Levels**: Around $67.00, where the price has previously found demand.
- **Key Resistance Levels**: Around $76.00, where selling pressure has emerged.
- **Dynamic Behavior**: The price is currently testing the support level. If it breaks, further downside is likely.

### Patterns and Indicators
- **Patterns**: No clear patterns like head and shoulders or triangles are visible.
- **Indicators**: Not specified on the chart, but the price action suggests bearish momentum.

## Trade Evaluation
Given the medium risk tolerance, a short position could be considered if the support level at $67.00 is broken with strong volume. However, if the price holds above this level, it may indicate a potential reversal or consolidation.

## Trade Execution Plan

- **Entry Triggers**: Enter a short position if the price closes below $67.00 with increased volume.
- **Multiple Entries/Scaling**: Consider scaling in if the price retests the $67.00 level after a breakout.
- **Volatility Adjustments**: Set stop loss above the recent high around $72.00 to account for volatility.
- **Dynamic Stop Loss**: Adjust stop loss to break-even once the price moves favorably by $2.00.
- **Confirmation from Indicators**: Look for confirmation from volume spikes or bearish candlestick patterns.

### Trade Parameters
- **Entry price**: Below $67.00
- **Stop Loss price**: $72.00
- **Take Profit price**: First target at $64.00

## Summary
- **Entry price:** Below $67.00
- **Stop Loss price:** $72.00
- **Take Profit price:** First: $64.00
- **Expected Duration:** 1-2 weeks
- **Conditions in which to re-evaluate the trade setup:** If the price holds above $67.00 or breaks above $72.00, reassess the bearish bias.
`
export const PLACEHOLDER_A2 = `## Key Takeaways

### Overall Market Bias
**Neutral to Bullish**

- **Daily Timeframe**: The overall trend appears bullish, with a recent breakout above previous resistance levels. The RSI is above 60, indicating bullish momentum, but it is slightly declining, suggesting a potential pullback.
- **4-Hour Timeframe**: Shows a recent pullback after a strong upward move. The RSI is around 46, indicating a neutral to slightly bearish short-term sentiment.
- **1-Hour Timeframe**: Displays a more immediate bearish correction, with the RSI at 31, indicating oversold conditions. This suggests a potential short-term reversal or consolidation.

The daily timeframe holds more weight for the overall bias due to its longer-term trend direction, but the 1-hour chart is crucial for identifying short-term entry points.

### Support and Resistance
- **Key Support Levels**:
  - Daily: $67,000
  - 4-Hour: $69,000
  - 1-Hour: $70,000

- **Key Resistance Levels**:
  - Daily: $72,500
  - 4-Hour: $72,000
  - 1-Hour: $71,500

- **Dynamic Behavior**: The price is currently testing the $70,000 support level on the 1-hour chart. If it holds, it could provide a base for a bullish move. Resistance at $72,500 on the daily chart is significant for a breakout strategy.

### Patterns and Indicators
- **Patterns**: No clear patterns like head and shoulders or triangles are visible. The price action suggests a potential consolidation phase.
- **Indicators**: 
  - **RSI**: Oversold on the 1-hour chart, neutral on the 4-hour, and slightly bullish on the daily.
  - **MACD**: Bearish crossover on the 1-hour and 4-hour charts, indicating short-term bearish momentum. The daily MACD is still in bullish territory but showing signs of weakening.

## Trade Evaluation
Given the breakout strategy and medium risk tolerance, the current setup suggests waiting for confirmation of support at $70,000 on the 1-hour chart. If the price holds and reverses, it could align with the breakout strategy.

## Trade Execution Plan
- **Entry Triggers**: Look for a bullish candlestick pattern or a MACD crossover on the 1-hour chart above $70,000.
- **Multiple Entries/Scaling**: Consider scaling in if the price confirms support at $70,000 and begins to rise.
- **Volatility Adjustments**: Set stop loss slightly below $69,000 to account for volatility.
- **Dynamic Stop Loss**: Move stop loss to break-even once the price reaches $71,500.
- **Confirmation from Indicators**: Look for RSI to move above 50 on the 1-hour chart for additional confirmation.

### Trade Parameters
- **Entry price**: $70,200
- **Stop Loss price**: $68,900
- **Take Profit price**: $72,500

## Summary
- **Entry price:** $70,200
- **Stop Loss price:** $68,900
- **Take Profit price:** $72,500
- **Expected Duration:** 1-3 days
- **Conditions in which to re-evaluate the trade setup:** If the price breaks below $68,900 or fails to reach $71,500 within 24 hours.\n\nThe MarkdownViewer component is responsible for displaying the text for the chart analysis as shown in the attached screenshot. As you can see the parser is having trouble parsing nested bullet point lists - specifically it is not indenting nested lists, and is also creating bullet points with empty lines as shown in the image. This of course is bad UX. Thoroughly review the code for the MarkdownViewer and the image and determine the fix and apply it to the code, if necessary consider using a function to preprocess the 'content' prop passed to the MarkdownViewer`
// export const PLACEHOLDER_ANALYSES = Array.from({length: 20}, (_, index)=> ({name: `analyses_${index}`, analyseUrl: `analyses_url_${index}`}) as IAnalysisUrl)