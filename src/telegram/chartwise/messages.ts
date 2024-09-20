export const ChartWiseKeyboard = {
    chart: 'Analyse Chart 📊',
    help: 'Help ❓',
} as const


export const SlashCommands: {command: string; description: string}[] = [
    {
      command: 'analyse',
      description: '📊 Analyse chart'
    },
    {
      command: 'help',
      description: '❓ Get help'
    },
  ] as const


export const HELP_MESSAGE = `

**Help Section: Uploading Chart Images**

Welcome to our chart analysis bot! To get the most accurate analysis, please follow these best practices when uploading your chart images:

**1. Show the full chart**: Make sure to capture the entire chart, including the time period at the bottom axis. This will help our bot understand the context of the chart and provide more accurate analysis.

**2. Include indicators**: If you have any indicators or overlays on your chart, such as moving averages, RSI, or Bollinger Bands, please include them in the image. This will help our bot identify key levels and patterns.

**3. Use a clear and legible chart**: Ensure that the chart is clear and easy to read. Avoid using charts with cluttered or overlapping elements that may make it difficult for our bot to analyze.

**4. Avoid cropped or zoomed-in charts**: Please upload the entire chart, rather than cropping or zooming in on a specific area. This will help our bot understand the overall trend and pattern of the chart.

**5. Image quality matters**: Try to upload high-quality images with good resolution. Avoid uploading low-resolution or blurry images that may make it difficult for our bot to analyze.

**6. Supported file formats**: Our bot supports the following file formats: JPEG, PNG. Please ensure that your image is in one of these formats before uploading.
`

export const UPLOAD_CHART_MESSAGE = 'Upload an image of the chart to analyse';

export const CHART_RECEIVED_MESSAGE = 'Chart received performing analysis please wait...';