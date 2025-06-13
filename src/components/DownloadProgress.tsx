import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconDownload } from './Icons';

interface DownloadProgressProps {
    progress: number;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({ progress }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <IconDownload className="w-4 h-4 text-blue-400" />
                    {t('controls.download.title')}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono bg-slate-700/50 px-2 py-1 rounded">
                        {progress.toFixed(1)}%
                    </span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
            </div>
            
            <div className="relative">
                <div className="w-full bg-slate-700/70 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-2 text-center">
                {t('controls.download.downloading')}
            </p>
        </div>
    );
};
