import { TradeJournalEntry } from "@/app/types"


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

export const placeholderEntries: TradeJournalEntry[] = [
  {
    entryId: 1,
    tradeDate: new Date('2024-01-01'),
    symbol: 'AAPL',
    type: 'buy',
    quantity: 50,
    entryPrice: 150,
    stopLoss: 145,
    takeProfit: 160,
    comments: 'Good entry point based on technical analysis.',
    sentiment: 'bullish',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    entryId: 2,
    tradeDate: new Date('2024-02-15'),
    symbol: 'TSLA',
    type: 'sell',
    quantity: 20,
    entryPrice: 700,
    stopLoss: 680,
    takeProfit: 720,
    comments: 'Short-term trade based on earnings report.',
    sentiment: 'bearish',
    createdAt: new Date('2024-02-15T10:00:00Z'),
    updatedAt: new Date('2024-02-15T10:00:00Z')
  },
  {
    entryId: 3,
    tradeDate: new Date('2024-03-10'),
    symbol: 'GOOGL',
    type: 'buy',
    quantity: 10,
    entryPrice: 2800,
    stopLoss: 2750,
    takeProfit: 2950,
    comments: 'Investing in the tech giant for long-term growth.',
    sentiment: 'bullish',
    createdAt: new Date('2024-03-10T10:00:00Z'),
    updatedAt: new Date('2024-03-10T10:00:00Z')
  },
  {
    entryId: 4,
    tradeDate: new Date('2024-04-05'),
    symbol: 'AMZN',
    type: 'sell',
    quantity: 5,
    entryPrice: 3300,
    stopLoss: 3280,
    takeProfit: 3350,
    comments: 'Short-term trade after quarterly earnings.',
    sentiment: 'neutral',
    createdAt: new Date('2024-04-05T10:00:00Z'),
    updatedAt: new Date('2024-04-05T10:00:00Z')
  },
  {
    entryId: 5,
    tradeDate: new Date('2024-05-20'),
    symbol: 'MSFT',
    type: 'buy',
    quantity: 30,
    entryPrice: 250,
    stopLoss: 245,
    takeProfit: 260,
    comments: 'Entering on a dip, expecting rebound.',
    sentiment: 'bullish',
    createdAt: new Date('2024-05-20T10:00:00Z'),
    updatedAt: new Date('2024-05-20T10:00:00Z')
  }
];