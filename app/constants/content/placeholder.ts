
export const testCharts = [
    {
        chartTitle: 'Sales Overview jbjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
        chartData: {
            xData: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            yData: [30, 45, 50, 40, 60],
            xLabel: 'Month',
            yLabel: 'Sales'
        },
        chartType: 'line'
    },
    {
        chartTitle: 'Revenue Growth',
        chartData: {
            xData: ['Q1', 'Q2', 'Q3', 'Q4'],
            yData: [15000, 20000, 18000, 22000],
            xLabel: 'Quarter',
            yLabel: 'Revenue'
        },
        chartType: 'bar'
    },
    {
        chartTitle: 'Customer Acquisition',
        chartData: {
            xData: ['2019', '2020', '2021', '2022'],
            yData: [200, 250, 300, 350],
            xLabel: 'Year',
            yLabel: 'Customers'
        },
        chartType: 'line'
    },
    {
        chartTitle: 'Product Performance',
        chartData: {
            xData: ['Product A', 'Product B', 'Product C'],
            yData: [120, 150, 180],
            xLabel: 'Product',
            yLabel: 'Performance'
        },
        chartType: 'bar'
    },
    {
        chartTitle: 'Website Traffic',
        chartData: {
            xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            yData: [300, 400, 350, 500, 600, 700, 650],
            xLabel: 'Day',
            yLabel: 'Visitors'
        },
        chartType: 'line'
    }
];

export const testAnalyses = [
    {
        name: 'Market Trends Analysis',
        analysis: 'An in-depth analysis of the current market trends, focusing on key areas of growth and potential challenges.'
    },
    {
        name: 'Customer Satisfaction Report',
        analysis: 'A comprehensive report on customer satisfaction levels, highlighting areas of improvement and customer feedback.'
    },
    {
        name: 'Product Performance Review',
        analysis: 'A detailed review of the performance of various products, with insights into sales and customer reception.'
    },
    {
        name: 'Financial Health Assessment',
        analysis: 'An assessment of the financial health of the company, including revenue, expenses, and profit margins.'
    },
    {
        name: 'Competitor Analysis',
        analysis: 'A competitive analysis of key players in the industry, identifying strengths, weaknesses, opportunities, and threats.'
    }
];


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