import { Analysis, IAnalyseCharts } from "@src/types";

const TASK_MESSAGE = `Please provide the following details based on your analysis of the chart and expert trading knowledge:`
const TASK_MESSAGE_SAC = `Strongly considering the trader's strategy and criteria, please provide the following details based on your analysis of the chart and expert trading knowledge:`

const getRiskTolerance = (risk?:string) => {
  if(!risk || isNaN(parseInt(risk || '')))return null;
  const parsedRisk = parseInt(risk)
  switch(true){
    case parsedRisk <= 0.33 * 100:
      return 'Low risk';
    case parsedRisk <= 0.66 * 100 && parsedRisk > 0.33 * 100:
      return 'Med risk';
    case parsedRisk > 0.66 * 100:
      return 'High risk';
    default:
      return 'Risk';
  }
}
export const chartAnalysisPrompt = (metadata:IAnalyseCharts['metadata']) => {
  const {strategyAndCriteria, risk} = metadata || {};
  return `
Meticulousy analyze the chart, paying close attention to the candlesticks, price action, anomalous price changes, and indicators, while referecning your expert knowledge on the asset being traded.

**First, determine the chart's bias:**

What is the overall bias of the chart?
- LONG BIAS (bullish trend or signals)
- SHORT BIAS (bearish trend or signals)
- NEUTRAL (no clear trend or signals)

${(strategyAndCriteria || risk) ? `**Strategy and Criteria: ${strategyAndCriteria??''}\n${risk? `Risk tolerance: ${getRiskTolerance(risk)}` : ''}**` : ''}

${strategyAndCriteria ? TASK_MESSAGE_SAC : TASK_MESSAGE}

## **Key Takeaways**

### Bias
Describe the bias and how you drew that conclusion

### Support and Resistance
- Support Level
- Resistance Level

### Volume
Describe the volume trends and their implications

### Patterns and Indicators
Identify and describe any relevant patterns, indicators, or candlestick patterns and their implications


## Strategy And Criteria Evaluation

Evaluate whether there is an optimal profitable trade setup with a clear bias, which matches the provided strategy and criteria (if any). If you cannot identify any trade setups in the chart that precisely match the strategy and criteria, inform the trader accordingly and do not proceed with trade execution details.
${strategyAndCriteria ? `
If the criteria includes a risk to reward ratio. Do not artifically create the ratio by setting unrealistic take profits or stop losses.` : ''}


## Trade Execution Strategy
Describe the proposed strategy for the trade, including how it meets the strategy and criteria (if provided). Explain the risk management approach. Once you have done this, provide the entry, stop loss and target prices as shown below.

### Distributed Entry Prices:
- First Entry: ([% Trade amount])
- Second Entry:([% Trade amount])

### Distributed Stop Loss Prices:
- First Stop Loss: ([% Trade amount])
- Second Stop Loss:([% Trade amount])

### Distributed Take Profit Prices:
- First Target:  ([% Trade amount])
- Second Target:  ([% Trade amount])

## **Summary**

- **Entry Prices:** First: [First Entry Price], Second: [Second Entry Price]
- **Stop Loss Levels:** First: [First Stop Loss Price], Second: [Second Stop Loss Price]
- **Target Prices:** First: [First Target Price], Second: [Second Target Price]
- **Expected Duration:** [Expected Duration]
- **Conditions in which to re-evaluate the trade setup:** [Conditions to Re-evaluate]

**Important: IF THE IMAGE IS NOT A CHART, inform the trader that they need to provide a chart before you can begin analysis**
`;
}

export const chartAnalysisMultiPrompt = (metadata:IAnalyseCharts['metadata']) => {
  const {strategyAndCriteria, risk} = metadata || {};
  return `
Meticulousy analyze the provided charts which show the same asset in the different timeframes. Pay close attention to the candlesticks, price action, anomalous price changes, and indicators, while referecning your expert knowledge on the asset being traded.

**First, determine the bias based on all charts:**

What is the overall bias of the chart?
- LONG BIAS (bullish trend or signals)
- SHORT BIAS (bearish trend or signals)
- NEUTRAL (no clear trend or signals)

${(strategyAndCriteria || risk) ? `**Strategy and Criteria: ${strategyAndCriteria??''}\n${risk? `Risk tolerance: ${getRiskTolerance(risk)}` : ''}**` : ''}

${strategyAndCriteria ? TASK_MESSAGE_SAC : TASK_MESSAGE}

## **Key Takeaways**

### Bias
Describe the bias and how you drew that conclusion

### Support and Resistance
- Support Level
- Resistance Level

### Volume
Describe the volume trends and their implications

### Patterns and Indicators
Identify and describe any relevant patterns, indicators, or candlestick patterns and their implications


## Strategy And Criteria Evaluation

Evaluate whether there is an optimal profitable trade setup with a clear bias, which matches the provided strategy and criteria (if any). If you cannot identify any trade setups in the chart that precisely match the strategy and criteria, inform the trader accordingly and do not proceed with trade execution details.
${strategyAndCriteria ? `
If the criteria includes a risk to reward ratio. Do not artifically create the ratio by setting unrealistic take profits or stop losses.` : ''}


## Trade Execution Strategy
Describe the proposed strategy for the trade, including how it meets the strategy and criteria (if provided). Explain the risk management approach. Once you have done this, provide the entry, stop loss and target prices as shown below.

### Distributed Entry Prices:
- First Entry: ([% Trade amount])
- Second Entry:([% Trade amount])

### Distributed Stop Loss Prices:
- First Stop Loss: ([% Trade amount])
- Second Stop Loss:([% Trade amount])

### Distributed Take Profit Prices:
- First Target:  ([% Trade amount])
- Second Target:  ([% Trade amount])

## **Summary**

- **Entry Prices:** First: [First Entry Price], Second: [Second Entry Price]
- **Stop Loss Levels:** First: [First Stop Loss Price], Second: [Second Stop Loss Price]
- **Target Prices:** First: [First Target Price], Second: [Second Target Price]
- **Expected Duration:** [Expected Duration]
- **Conditions in which to re-evaluate the trade setup:** [Conditions to Re-evaluate]

**Important: IF THE IMAGE IS NOT A CHART, inform the trader that they need to provide a chart before you can begin analysis**
`;
}