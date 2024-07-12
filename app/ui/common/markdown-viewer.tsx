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
    <div className="relative w-full max-w-[100%] mx-auto animate-fadeIn p-4 mt-4 rounded-md text-gray-200 text-left">
        <ReactMarkdown
          children={info}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="leading-relaxed mb-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-4" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-4" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-4" {...props} />,
          }}
        />
    </div>
  );
};
