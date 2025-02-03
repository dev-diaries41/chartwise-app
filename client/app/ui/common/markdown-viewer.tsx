import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
}

export default function MarkdownView({ content }: MarkdownViewProps) {
  const formatMarkdownContent = (content: string): string => {
    // Step 1: Replace `-` with `*` for list items
    let formattedContent = content.replace(/^- /gm, '* ');
    // formattedContent = formattedContent.replace(/^  - /gm, '  * ');
    // Step 2: Remove extra blank lines between list items
    // This uses a regular expression to replace multiple newlines between lists with a single newline
    formattedContent = formattedContent.replace(/\n{2,}(\*|\d+\.)/g, '\n$1');
  
    return formattedContent;
  };
  return (
    <div className="relative w-full flex flex-col animate-fadeIn mt-4 rounded-md text-left ">
      <div className="markdown-container p-4 ">
        <ReactMarkdown
          children={formatMarkdownContent(content)}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="leading-relaxed mb-6" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-6" {...props} />,
            li: ({ node, ...props }) => <li className={`mb-3`} {...props} />,
            ol: ({ node, ...props }) => <ol className=" list-inside mb-2" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-2xl md:text-2xl font-extrabold mb-6 mt-8" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-semibold mb-4 mt-6" {...props} />,
            h3: ({ node, ...props }) => <h3 className="md:text-lg font-semibold mb-2 mt-4" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-4" {...props} />,
          }}
        />
      </div>
    </div>
  );
};