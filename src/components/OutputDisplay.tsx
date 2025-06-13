import React from 'react';
import { useTranslation } from 'react-i18next';

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
            className="flex-grow mt-2 sm:mt-4 bg-slate-900/90 p-3 sm:p-4 rounded-lg border border-slate-700 whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-300 overflow-y-auto shadow-inner transition-all duration-300 max-h-[50vh] min-h-[200px] sm:min-h-[250px] backdrop-blur-sm"
        >
            {output ? (
                <div className="animate-in fade-in duration-300">{output}</div>
            ) : (
                <div className="text-slate-500 h-full flex items-center justify-center italic text-center p-4">
                    {t('prompt.empty')}
                </div>
            )}
        </div>
    );
};
