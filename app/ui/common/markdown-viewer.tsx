import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
}

export default function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <div className="relative w-full flex flex-col max-w-[90%] mx-auto animate-fadeIn mt-4 rounded-md text-left ">
      <div className="markdown-container p-4 ">
        <ReactMarkdown
          children={content}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="leading-relaxed mb-6 text-md md:text-lg" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-md md:text-lg mb-6" {...props} />,
            li: ({ node, ...props }) => <li className="mb-3" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-md md:text-lg mb-6" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-8" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg md:text-2xl font-bold mb-4 mt-6" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-md md:text-lg font-semibold mb-3 mt-4" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-4" {...props} />,
          }}
        />
      </div>
    </div>
  );
};