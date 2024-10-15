import CarouselImageViewer from '@/app/ui/common/image-carousel';

const tradingAssistantGuide = {
  title: "Chart Upload Guidelines",
  steps: [
    {
      title: "Show the full chart",
      description: "Make sure to capture the entire chart, including the time period on the bottom axis. This will help provide the context of the chart and ensure a more accurate analysis."
    },
    {
      title: "Include indicators",
      description: "If you have any indicators or overlays on your chart, such as moving averages, RSI, or Bollinger Bands, please include them in the image. This will help identify key levels and patterns."
    },
    {
      title: "Use a clear and legible chart",
      description: "Ensure that the chart is clear and easy to read. Avoid using charts with cluttered or overlapping elements."
    },
    {
      title: "Avoid cropped or zoomed-in charts",
      description: "Please upload the entire chart, rather than cropping or zooming in on a specific area. This provides the context of the overall trend and pattern of the chart, allowing for better analysis."
    },
    {
      title: "Image quality matters",
      description: "Try to upload high-quality images with good resolution. Avoid uploading low-resolution or blurry images that may make it difficult to analyse the chart."
    },
    {
      title: "Supported file formats",
      description: "JPEG, PNG. Please ensure that your image is in one of these formats before uploading."
    }
  ]
};

export const revalidate = false;


export default function TradingAssistantGuide(){
  return(
    <div className="flex flex-col w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">{tradingAssistantGuide.title}</h1>
  
      {tradingAssistantGuide.steps.map((step, index) => (
        <div key={index} className="flex flex-col mb-8">
          <div className="flex flex-col mx-auto w-full mb-6">
            <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
      
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Example Charts</h2>
        <CarouselImageViewer images={['/correct-chart-new.png', '/incorrect-chart-new.png']} />
      </div>
    </div>
  );
} 