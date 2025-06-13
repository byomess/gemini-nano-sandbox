import React from 'react';
import type { ModelParams, ModelStatus } from '../types/gemini';
import { IconLoader } from './Icons';

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
        <>
            {status === 'downloading' && (
                <div className="w-full bg-slate-700/70 rounded-full h-2 sm:h-2.5 mb-5 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-lg"
                        style={{ width: `${downloadProgress}%` }}
                    >
                        <div className="h-full w-full bg-opacity-50 animate-pulse"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-right">
                        {downloadProgress.toFixed(1)}% concluído
                    </p>
                </div>
            )}

            {/* Parâmetros do Modelo */}
            {modelParams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-5 sm:mb-6">
                    <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                        <label htmlFor="temperature" className="flex mb-2 text-sm font-medium text-slate-300 justify-between">
                            <span>Temperatura:</span> <span className="font-bold text-cyan-400 bg-slate-900/50 px-2 py-0.5 rounded">{temperature.toFixed(1)}</span>
                        </label>
                        <input
                            id="temperature"
                            type="range"
                            min="0.0"
                            max={modelParams.maxTemperature}
                            step="0.1"
                            value={temperature}
                            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500 mt-2 italic">Valores mais altos = mais criativo. Use antes de iniciar.</p>
                    </div>
                    <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                        <label htmlFor="topK" className="flex mb-2 text-sm font-medium text-slate-300 justify-between">
                            <span>Top-K:</span> <span className="font-bold text-purple-400 bg-slate-900/50 px-2 py-0.5 rounded">{topK}</span>
                        </label>
                        <input
                            id="topK"
                            type="range"
                            min="1"
                            max={modelParams.maxTopK}
                            step="1"
                            value={topK}
                            onChange={(e) => onTopKChange(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500 mt-2 italic">Altera o conjunto de tokens considerados. Use antes de iniciar.</p>
                    </div>
                </div>
            )}

            {/* Botão de Iniciar/Reiniciar */}
            <button
                onClick={onInitialize}
                disabled={status === 'initializing' || status === 'downloading'}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 transform hover:translate-y-[-1px] active:translate-y-[1px]"
            >
                {(status === 'initializing' || status === 'downloading') && <IconLoader className="w-5 h-5" />}
                {status === 'ready' ? 'Reiniciar Sessão com Novos Parâmetros' : 'Iniciar Sessão'}
            </button>
        </>
    );
};
