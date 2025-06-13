import React from 'react';
import type { ModelStatus } from '../types/gemini';

interface StatusIndicatorProps {
    status: ModelStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    const statusConfig = {
        unverified: { bg: 'bg-gray-500', ring: 'ring-gray-400/30' },
        initializing: { bg: 'bg-blue-500', ring: 'ring-blue-400/50' },
        downloading: { bg: 'bg-orange-500', ring: 'ring-orange-400/50' },
        ready: { bg: 'bg-green-500', ring: 'ring-green-400/50' },
        error: { bg: 'bg-red-500', ring: 'ring-red-400/50' },
    };

    // Animação adicional para status específicos
    const pulseClasses = status === 'initializing' || status === 'downloading' 
        ? 'animate-pulse' 
        : '';

    // Classe de tamanho responsivo
    const sizeClass = 'w-2.5 h-2.5 sm:w-3 sm:h-3';
    const glowClass = status === 'ready' ? 'shadow-[0_0_10px_rgba(74,222,128,0.5)]' : '';
    
    return (
        <span 
            className={`${sizeClass} rounded-full ${statusConfig[status].bg} ${pulseClasses} ${glowClass} transition-all duration-300 ring-2 ${statusConfig[status].ring}`}
        ></span>
    );
};
