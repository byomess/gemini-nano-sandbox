import React from 'react';
import type { ModelStatus } from '../types/gemini';
import { StatusIndicator } from './StatusIndicator';

interface StatusDisplayProps {
    status: ModelStatus;
    statusMessage: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, statusMessage }) => {
    return (
        <div className="flex items-center gap-3 mb-4 sm:mb-6 p-2 sm:p-3 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 transition-all duration-300 transform hover:border-slate-700">
            <StatusIndicator status={status} />
            <span className="text-slate-300 text-xs sm:text-sm flex-1 line-clamp-2 md:line-clamp-none">{statusMessage}</span>
        </div>
    );
};
