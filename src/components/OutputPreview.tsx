import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Sparkles } from 'lucide-react';

interface OutputPreviewProps {
  content: string | null;
  error: string | null;
}

export const OutputPreview: React.FC<OutputPreviewProps> = ({ content, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="bg-shapr-card border border-red-900/50 rounded-lg p-6 h-full flex items-center justify-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-shapr-card border border-shapr-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4 border border-gray-800">
            <Sparkles className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-sm font-medium">Ready to generate.</p>
        <p className="text-xs text-gray-600 mt-1">Fill in the details on the left to start.</p>
      </div>
    );
  }

  return (
    <div className="bg-shapr-card border border-shapr-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-shapr-blue flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Generated Result
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-medium bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-700"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <div className="flex-grow overflow-auto pr-2 custom-scrollbar">
        <article className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
             components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-tight" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mt-10 mb-4 border-l-4 border-shapr-blue pl-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold text-gray-200 mt-4 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-1 text-gray-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                hr: ({node, ...props}) => <hr className="border-gray-800 my-6" {...props} />,
             }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};