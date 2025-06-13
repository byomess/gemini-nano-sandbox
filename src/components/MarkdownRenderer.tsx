import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { IconCheck, IconCopy } from './Icons';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

    const copyToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Títulos com gradiente (sem animação)
                    h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 mt-6 first:mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3 mt-5 first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2 mt-4 first:mt-0">
                            {children}
                        </h3>
                    ),
                    // Parágrafos
                    p: ({ children }) => (
                        <p className="text-slate-300 mb-4 leading-relaxed">
                            {children}
                        </p>
                    ),
                    // Links com estilo moderno
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    // Listas
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-slate-300 hover:text-slate-200 transition-colors duration-200">
                            {children}
                        </li>
                    ),
                    // Citações
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500 bg-purple-900/20 pl-4 py-2 mb-4 italic text-purple-200">
                            {children}
                        </blockquote>
                    ),
                    // Tabelas
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-slate-600 rounded-lg overflow-hidden">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-slate-700">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-2 text-left text-slate-200 font-semibold border-b border-slate-600">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-2 text-slate-300 border-b border-slate-700">
                            {children}
                        </td>
                    ),
                    // Código inline
                    code: ({ children, className }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        
                        if (!match) {
                            // Código inline
                            return (
                                <code className="bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-600">
                                    {children}
                                </code>
                            );
                        }
                        
                        // Bloco de código
                        const codeString = String(children).replace(/\n$/, '');
                        
                        return (
                            <div 
                                className="relative group mb-4"
                            >
                                <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border border-slate-600">
                                    <span className="text-sm text-slate-400 font-medium">
                                        {language || 'code'}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(codeString)}
                                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                                    >
                                        {copiedCode === codeString ? (
                                            <>
                                                <IconCheck className="w-4 h-4" />
                                                Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <IconCopy className="w-4 h-4" />
                                                Copiar
                                            </>
                                        )}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={language}
                                    PreTag="div"
                                    className="!mt-0 !rounded-t-none !border-t-0"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0 0 0.5rem 0.5rem',
                                        border: '1px solid rgb(71 85 105)',
                                        borderTop: 'none',
                                        background: 'rgb(15 23 42)',
                                    }}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        );
                    },
                    // Separadores
                    hr: () => (
                        <hr className="border-slate-600 my-6" />
                    ),
                    // Strong e em
                    strong: ({ children }) => (
                        <strong className="text-white font-semibold">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="text-purple-300 italic">
                            {children}
                        </em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
