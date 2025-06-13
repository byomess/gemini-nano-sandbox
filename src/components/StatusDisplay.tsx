import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ModelStatus } from '../types/gemini';
import { IconCheckCircle, IconClock, IconDownload, IconLoader, IconXCircle } from './Icons';
import { StatusIndicator } from './StatusIndicator';

interface StatusDisplayProps {
    status: ModelStatus;
    statusMessage: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, statusMessage }) => {
    const { t } = useTranslation();
    
    const getStatusColor = (status: ModelStatus) => {
        switch (status) {
            case 'ready': return 'from-green-500/20 to-emerald-500/10 border-green-500/30';
            case 'initializing': return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30';
            case 'downloading': return 'from-purple-500/20 to-indigo-500/10 border-purple-500/30';
            case 'error': return 'from-red-500/20 to-rose-500/10 border-red-500/30';
            default: return 'from-slate-500/20 to-gray-500/10 border-slate-500/30';
        }
    };

    const getStatusIcon = (status: ModelStatus) => {
        switch (status) {
            case 'ready': return <IconCheckCircle className="w-6 h-6 text-green-400" />;
            case 'initializing': return <IconLoader className="w-6 h-6 text-blue-400" />;
            case 'downloading': return <IconDownload className="w-6 h-6 text-purple-400" />;
            case 'error': return <IconXCircle className="w-6 h-6 text-red-400" />;
            default: return <IconClock className="w-6 h-6 text-slate-400" />;
        }
    };

    return (
        <motion.div 
            className={`bg-gradient-to-r ${getStatusColor(status)} backdrop-blur-sm rounded-xl border p-4 mb-6 relative overflow-hidden`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Pulse effect for active status */}
            {(status === 'initializing' || status === 'downloading') && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
            )}
            
            <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <StatusIndicator status={status} />
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-200 mb-1 capitalize">
                        Status: {status === 'ready' ? t('controls.status.ready') : 
                               status === 'initializing' ? t('controls.status.initializing') : 
                               status === 'downloading' ? t('controls.status.downloading') : 
                               status === 'error' ? t('controls.status.error') : t('controls.status.unverified')}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed break-words">
                        {statusMessage}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
