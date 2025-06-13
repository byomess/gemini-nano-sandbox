import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLoader, IconRocket, IconSparkles, IconStop } from './Icons';

interface PromptInterfaceProps {
    prompt: string;
    isLoading: boolean;
    onPromptChange: (value: string) => void;
    onSendPrompt: () => void;
    onStop: () => void;
}

export const PromptInterface: React.FC<PromptInterfaceProps> = ({
    prompt,
    isLoading,
    onPromptChange,
    onSendPrompt,
    onStop,
}) => {
    const { t } = useTranslation();
    
    // Função para ajustar a altura do textarea automaticamente
    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        // Reset height para calcular o tamanho correto
        textarea.style.height = 'auto';
        // Ajusta a altura com base no conteúdo
        textarea.style.height = `${Math.min(300, Math.max(100, textarea.scrollHeight))}px`;
        // Passa o valor para o handler
        onPromptChange(textarea.value);
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
            {/* Efeito de brilho no topo */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            
            {/* Área do textarea */}
            <div className="relative mb-6">
                <label htmlFor="prompt-input" className="flex text-sm font-medium text-slate-300 mb-3 items-center gap-2">
                    <IconSparkles className="w-4 h-4" />
                    Digite sua pergunta ou prompt:
                </label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={handleTextareaInput}
                    placeholder={t('prompt.placeholder')}
                    rows={4}
                    className="w-full p-4 bg-slate-900/80 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all duration-300 resize-none min-h-[120px] text-slate-200 placeholder-slate-500 backdrop-blur-sm"
                    style={{ 
                        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}
                />
                
                {/* Contador de caracteres */}
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                    {prompt.length} caracteres
                </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onSendPrompt}
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cyan-500/25"
                >
                    {isLoading ? (
                        <>
                            <IconLoader className="w-5 h-5" />
                            Gerando...
                        </>
                    ) : (
                        <>
                            <IconRocket className="w-5 h-5" />
                            {t('prompt.send')}
                        </>
                    )}
                </button>
                
                <button
                    onClick={onStop}
                    disabled={!isLoading}
                    className="sm:w-auto w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/25"
                >
                    <span className="flex items-center justify-center gap-2">
                        <IconStop className="w-5 h-5" />
                        {t('prompt.stop')}
                    </span>
                </button>
            </div>

            {/* Sugestões de prompts */}
            {!prompt && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                        <IconSparkles className="w-4 h-4" />
                        Sugestões de prompts:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                            "Explique como funciona a inteligência artificial",
                            "Crie uma função JavaScript para ordenar arrays",
                            "Quais são as melhores práticas de React?",
                            "Como otimizar performance web?"
                        ].map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => onPromptChange(suggestion)}
                                className="text-left text-sm text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
                            >
                                "{suggestion}"
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
