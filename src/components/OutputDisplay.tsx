import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSparkles } from './Icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface OutputDisplayProps {
    output: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
    const { t } = useTranslation();
    
    // Referência para o container de output
    const outputRef = React.useRef<HTMLDivElement>(null);
    
    // Efeito para scrollar automaticamente quando o output for atualizado
    React.useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div 
            ref={outputRef}
            className="flex-grow mt-2 sm:mt-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-4 sm:p-6 rounded-xl border border-slate-700/50 overflow-y-auto shadow-xl transition-all duration-300 max-h-[60vh] min-h-[300px] sm:min-h-[350px] backdrop-blur-sm relative"
        >
            {/* Efeito de gradiente no topo */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            {output ? (
                <MarkdownRenderer 
                    content={output} 
                    className="prose prose-invert max-w-none"
                />
            ) : (
                <div 
                    className="h-full flex items-center justify-center"
                >
                    <div className="text-center">
                        <IconSparkles className="w-16 h-16 mb-4 text-slate-600 mx-auto" />
                        <p className="text-slate-500 italic text-lg font-medium">
                            {t('prompt.empty')}
                        </p>
                        <p className="text-slate-600 text-sm mt-2">
                            Digite sua pergunta acima para começar
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
