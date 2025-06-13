import React from 'react';
import type { ModelParams, ModelStatus } from '../types/gemini';
import { ActionButton } from './ActionButton';
import { DownloadProgress } from './DownloadProgress';
import { ModelParameters } from './ModelParameters';

interface ModelControlsProps {
    status: ModelStatus;
    modelParams: ModelParams | null;
    temperature: number;
    topK: number;
    downloadProgress: number;
    onTemperatureChange: (value: number) => void;
    onTopKChange: (value: number) => void;
    onInitialize: () => void;
}

export const ModelControls: React.FC<ModelControlsProps> = ({
    status,
    modelParams,
    temperature,
    topK,
    downloadProgress,
    onTemperatureChange,
    onTopKChange,
    onInitialize,
}) => {
    return (
        <div className="space-y-6">
            {/* Progress Section - Mostrado durante download */}
            {status === 'downloading' && (
                <DownloadProgress progress={downloadProgress} />
            )}

            {/* Model Parameters - Mostrado apenas quando disponível */}
            {modelParams && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                    <ModelParameters
                        modelParams={modelParams}
                        temperature={temperature}
                        topK={topK}
                        onTemperatureChange={onTemperatureChange}
                        onTopKChange={onTopKChange}
                    />
                </div>
            )}

            {/* Action Button - Sempre visível */}
            <ActionButton
                status={status}
                onInitialize={onInitialize}
            />
        </div>
    );
};
