import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ModelParams } from '../types/gemini';
import { IconCpu, IconTarget } from './Icons';
import { Slider } from './Slider';

interface ModelParametersProps {
    modelParams: ModelParams;
    temperature: number;
    topK: number;
    onTemperatureChange: (value: number) => void;
    onTopKChange: (value: number) => void;
}

export const ModelParameters: React.FC<ModelParametersProps> = ({
    modelParams,
    temperature,
    topK,
    onTemperatureChange,
    onTopKChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shrink-0">
                    <IconCpu className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{t('controls.modelInfo.title')}</h3>
                    <p className="text-sm text-slate-400">{t('controls.modelInfo.subtitle')}</p>
                </div>
            </div>
            
            <div className="space-y-6">
                {/* Temperature Control */}
                <Slider
                    id="temperature"
                    label={t('controls.temperature.label')}
                    value={temperature}
                    min={0.0}
                    max={modelParams.maxTemperature}
                    step={0.1}
                    onChange={onTemperatureChange}
                    icon={<IconCpu className="w-4 h-4" />}
                    description={t('controls.temperature.description')}
                    valueColor="cyan"
                    formatValue={(value: number) => value.toFixed(1)}
                />

                {/* TopK Control */}
                <Slider
                    id="topk"
                    label={t('controls.topK.label')}
                    value={topK}
                    min={1}
                    max={modelParams.maxTopK}
                    step={1}
                    onChange={onTopKChange}
                    icon={<IconTarget className="w-4 h-4" />}
                    description={t('controls.topK.description')}
                    valueColor="purple"
                />
            </div>
        </div>
    );
};
