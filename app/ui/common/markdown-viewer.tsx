import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface InfoDisplayProps {
  title?: string;
  info: string;
}

export default function InfoDisplay({ info, title = 'Information' }: InfoDisplayProps) {
  return (
    <div className="relative w-full flex flex-col max-w-[90%] mx-auto animate-fadeIn  mt-4 rounded-md text-gray-200 text-left ">
      <div className="markdown-container p-4 ">
        <ReactMarkdown
          children={info}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="leading-relaxed mb-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-4 mt-8" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-md font-bold mb-3 mt-6" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mb-1 mt-2" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-2" {...props} />,
          }}
        />
      </div>
    </div>
  );
};