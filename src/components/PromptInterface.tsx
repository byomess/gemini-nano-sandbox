import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLoader } from './Icons';

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
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-3 sm:gap-4">
            <textarea
                value={prompt}
                onChange={handleTextareaInput}
                placeholder={t('prompt.placeholder')}
                rows={4}
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none transition-all resize-y min-h-[100px]"
            />
            <div className="flex flex-col xs:flex-row gap-3 mt-1">
                <button
                    onClick={onSendPrompt}
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading ? <IconLoader className="w-5 h-5" /> : t('prompt.send')}
                </button>
                <button
                    onClick={onStop}
                    disabled={!isLoading}
                    className="flex-1 xs:flex-initial xs:w-32 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {t('prompt.stop')}
                </button>
            </div>
        </div>
    );
};
