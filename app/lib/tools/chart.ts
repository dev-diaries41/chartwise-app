import { ChartData, JsonChartData } from "@/app/types";
import { PlotType } from "plotly.js-dist-min";

// Function to read a file as text
function readFileAsText(file: File, onLoad: (result: string) => void, onError: () => void): void {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    if (event.target && event.target.result && typeof event.target.result === 'string') {
      onLoad(event.target.result);
    } else {
      console.error('Error reading file.');
      onError();
    }
  };

  reader.onerror = () => {
    console.error('Error reading file.');
    onError();
  };

  reader.readAsText(file);
}

// CSV data extraction
export function extractChartDataCsv(file: File, callback: (chartData: ChartData | null) => void): void {
  readFileAsText(file, (csvData) => {
    try{
      const lines = csvData.trim().split(/\r?\n/);
    
      if (lines.length < 2) throw new Error('CSV data should have at least two rows.');
  
      // Extract headers to use as x and y labels
      const [xLabel, yLabel] = lines.shift()!.split(',');
  
      const xData: (string | number)[] = [];
      const yData: number[] = [];
  
      lines.forEach(line => {
        const [x, y] = line.split(',').map((value, index) => index === 0 ? value.trim() : parseFloat(value.trim()));
        if (!isNaN(y as number)) {
          xData.push(x);
          yData.push(y as number);
        }
      });
  
      const chartData: ChartData = {
        xData,
        yData,
        xLabel,
        yLabel,
      };
  
      if(xData.length === 0 || yData.length === 0 )throw new Error('Invalid data format: Please read the guidelines')
      
      callback(chartData);
    }catch(error){
      console.error('Error parsing JSON file:', error);
      callback(null);
    }

  }, () => callback(null));
}

// Markdown data extraction
export function extractChartDataFromMd(file: File, callback: (chartData: ChartData | null) => void): void {
  readFileAsText(file, (mdData) => {
    try{
      const lines = mdData.trim().split(/\r?\n/);

      if (lines.length < 3) throw new Error('Markdown data should have at least a header and one data row.');
  
      const [xLabel, yLabel] = lines[0].split('|').map(label => label.trim()).filter(label => label);
      
      const xData: (string | number)[] = [];
      const yData: number[] = [];
  
      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length === 2) {
          const x = cells[0];
          const y = parseFloat(cells[1]);
          if (!isNaN(y)) {
            xData.push(x);
            yData.push(y);
          }
        }
      }
  
      const chartData: ChartData = {
        xData,
        yData,
        xLabel,
        yLabel,
      };
  
      if(xData.length === 0 || yData.length === 0 )throw new Error('Invalid data format: Please read the guidelines')
  
      callback(chartData);
    }catch(error){
      console.error('Error parsing JSON file:', error);
      callback(null);
    }
    
  }, () => callback(null));
}

// JSON data extraction
export function extractChartDataFromJson(file: File, callback: (chartData: ChartData | null) => void): void {
  readFileAsText(file, (jsonData) => {
    try {
      const parsedData: JsonChartData = JSON.parse(jsonData);

      if (!parsedData.data) {
        console.error('Invalid JSON format.');
        callback(null);
        return;
      }

      const xData: string[] = [];
      const yData: number[] = [];

      Object.entries(parsedData.data).forEach(([key, value]) => {
        xData.push(key);
        yData.push(value);
      });

      const chartData: ChartData = {
        xData,
        yData,
        xLabel: parsedData.xLabel = '',
        yLabel: parsedData.yLabel = '',
      };

      if(xData.length === 0 || yData.length === 0 )throw new Error('Invalid data format: Please read the guidelines')

      callback(chartData);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      callback(null);
    }
  }, () => callback(null));
}

export function extractChartData(file: File, callback: (chartData: ChartData | null) => void): void {
  switch (file.type) {
    case 'text/csv':
      extractChartDataCsv(file, callback);
      break;
    case 'text/markdown':
    case 'text/x-markdown':
      extractChartDataFromMd(file, callback);
      break;
    case 'application/json':
      extractChartDataFromJson(file, callback);
      break;
    default:
      console.error('Unsupported file type.');
      callback(null);
  }
}

export function formatCharData(chartData: any, chartType: string){
  let formattedChartData = { x: chartData.xData, y: chartData.yData, type: chartType  as PlotType}
  if(chartType === 'horizontal bar'){
    return { x: chartData.yData, y: chartData.xData, type: 'bar' as PlotType, orientation: 'h' as 'h' | 'v'}
  }
  if(chartType === 'pie') {
    return { values: chartData.yData, labels: chartData.xData, type: chartType as PlotType}
  }
  return formattedChartData;
}

export function getChartLayout(chartTitle: string, chartData: ChartData) {
  return {
    title: chartTitle,
    xaxis: {
      title: chartData.xLabel,
      automargin: true,
      tickfont: {
        size: 10,
        color: 'black',
      },
    },
    yaxis: {
      title: chartData.yLabel,
      automargin: true,
    },
  };
}