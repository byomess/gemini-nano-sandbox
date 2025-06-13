import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ModelStatus } from '../types/gemini';
import { IconLoader, IconRocket } from './Icons';

interface ActionButtonProps {
    status: ModelStatus;
    onInitialize: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ status, onInitialize }) => {
    const { t } = useTranslation();

    const isDisabled = status === 'initializing' || status === 'downloading';
    const isLoading = status === 'initializing' || status === 'downloading';

    return (
        <button
            onClick={onInitialize}
            disabled={isDisabled}
            className="group w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-600 hover:via-indigo-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden border border-white/10"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                    <IconLoader className="w-5 h-5" />
                ) : (
                    <div className="p-1 bg-white/20 rounded-lg">
                        <IconRocket className="w-4 h-4" />
                    </div>
                )}
                
                <div className="text-left">
                    <div className="text-base font-bold">
                        {status === 'ready' ? t('controls.buttons.restart') : t('controls.buttons.start')}
                    </div>
                    <div className="text-xs opacity-80">
                        {status === 'ready' ? t('controls.buttons.restartSubtitle') : t('controls.buttons.startSubtitle')}
                    </div>
                </div>
            </div>
        </button>
    );
};
