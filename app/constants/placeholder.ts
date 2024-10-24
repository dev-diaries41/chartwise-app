import { IAnalysisUrl, TradeJournalEntry } from "@/app/types"


export const PLACEHOLDER_ANALYSIS = `# Key Takeaways


## Bias

  - Describe the bias and how you drew that conclusion: [Bias Description]

## Support And Resistance

### Support Level
    - Support Level: [Support Level]

### Resistance Level
    - Resistance Level: [Resistance Level]

## Volume

  - Describe the volume trends and their implications: [Volume Description]

## Patterns And Indicators

  - Identify and describe any relevant patterns, indicators, or candlestick patterns and their implications: [Pattern and Indicator Description]

# Strategy And Criteria Evaluation


- Evaluate whether there is an optimal profitable trade setup with a clear bias, which matches the provided strategy and criteria (if any). If you cannot identify any trade setups in the chart that match the strategy and criteria, inform the trader accordingly and do not proceed with trade execution details.

If the criteria includes a risk to reward ratio. Do not artificially create the ratio by setting unrealistic take profits or stop losses.

# Trade Execution Strategy


## Strategy Overview

  - If there is an optimal trade, describe the optimal execution strategy based on your meticulous analysis.

## Distributed Entry Prices

### First Entry
    - First Entry: [First Entry Price] ([% Trade amount])

### Second Entry
    - Second Entry: [Second Entry Price] ([% Trade amount])

## Distributed Stop Loss Prices

### First Stop Loss
    - First Stop Loss: [First Stop Loss] ([% Trade amount])

### Second Stop Loss
    - Second Stop Loss: [Second Stop Loss] ([% Trade amount])

## Distributed Take Profit Prices

### First Target
    - First Target: [First Target Price] ([% Trade amount])

### Second Target
    - Second Target: [Second Target Price] ([% Trade amount])

# Summary


## Entry Prices

### First
    - First: [First Entry Price]

### Second
    - Second: [Second Entry Price]

## Stop Loss Levels

### First
    - First: [First Stop Loss Price]

### Second
    - Second: [Second Stop Loss Price]

## Target Prices

### First
    - First: [First Target Price]

### Second
    - Second: [Second Target Price]

## Expected Duration

  - Expected Duration: [Expected Duration]

## Conditions To Re Evaluate

  - Conditions in which to re-evaluate the trade setup: [Conditions to Re-evaluate]

# Note


- Important: IF THE IMAGE IS NOT A CHART, inform the trader that they need to provide a chart before you can begin analysis.


`

// export const PLACEHOLDER_ANALYSES = Array.from({length: 20}, (_, index)=> ({name: `analyses_${index}`, analyseUrl: `analyses_url_${index}`}) as IAnalysisUrl)