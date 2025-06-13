import React, { useCallback, useEffect, useRef, useState } from 'react';

// --- Tipos para a API LanguageModel (para segurança de tipo no TypeScript) ---
// Estes tipos podem não ser exportados oficialmente, então os definimos para nosso uso.
interface LanguageModel {
    availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;
    create(options?: CreateSessionOptions): Promise<Session>;
    params(): Promise<ModelParams>;
}

interface CreateSessionOptions {
    topK?: number;
    temperature?: number;
    signal?: AbortSignal;
    monitor?: (monitor: { addEventListener: (event: string, listener: (e: any) => void) => void }) => void;
}

interface Session {
    prompt(prompt: string, options?: { signal?: AbortSignal }): Promise<string>;
    promptStreaming(prompt: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
    destroy(): void;
}

interface ModelParams {
    defaultTopK: number;
    maxTopK: number;
    defaultTemperature: number;
    maxTemperature: number;
}

// Declarando a API no escopo global para o TypeScript
declare global {
    interface Window {
        LanguageModel?: LanguageModel;
    }
}

// --- Ícones como componentes SVG para uso fácil ---
const IconSparkles = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 4.2-4.3.4 3.3 2.9-.9 4.2 3.8-2.3 3.8 2.3-.9-4.2 3.3-2.9-4.3-.4L12 3zM5 13l-2.2 4.8-5 .5 3.8 3.4-1 4.8L4 22l4.3-2.6L12.6 22l-1-4.8 3.8-3.4-5-.5L8 13z" /></svg>
);

const IconLoader = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={`animate-spin ${props.className || ''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

// --- Componente Principal da Aplicação ---
export default function App() {
    // --- Estados do Componente ---
    const [status, setStatus] = useState<'unverified' | 'initializing' | 'downloading' | 'ready' | 'error'>('unverified');
    const [statusMessage, setStatusMessage] = useState('Clique em "Iniciar" para verificar a disponibilidade do modelo.');
    const [session, setSession] = useState<Session | null>(null);
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // --- Estados para os Parâmetros do Modelo ---
    const [modelParams, setModelParams] = useState<ModelParams | null>(null);
    const [temperature, setTemperature] = useState(1.0);
    const [topK, setTopK] = useState(3);

    // --- Refs ---
    const abortControllerRef = useRef<AbortController | null>(null);

    // --- Efeito para carregar os parâmetros do modelo ao montar ---
    useEffect(() => {
        async function fetchParams() {
            if (window.LanguageModel) {
                try {
                    const params = await window.LanguageModel.params();
                    setModelParams(params);
                    setTemperature(params.defaultTemperature);
                    setTopK(params.defaultTopK);
                } catch (e) {
                    console.error("Não foi possível carregar os parâmetros do modelo:", e);
                }
            }
        }
        fetchParams();
    }, []);

    // --- Funções Principais (usando useCallback para otimização) ---
    const handleInitialize = useCallback(async () => {
        if (!window.LanguageModel) {
            setStatus('error');
            setStatusMessage('API LanguageModel não encontrada. Certifique-se de que está no Chrome com as flags corretas.');
            return;
        }

        try {
            setStatus('initializing');
            setStatusMessage('Verificando disponibilidade do modelo...');

            const availability = await window.LanguageModel.availability();

            if (availability === 'unavailable') {
                setStatus('error');
                setStatusMessage('Modelo indisponível. Verifique os requisitos de hardware e sistema.');
                return;
            }

            if (availability === 'downloadable' || availability === 'downloading') {
                setStatus('downloading');
                setStatusMessage('Fazendo download do modelo. Isso pode levar alguns minutos.');
            } else {
                setStatusMessage('Modelo disponível. Criando sessão...');
            }

            // Destrói a sessão anterior se existir
            if (session) {
                session.destroy();
                setSession(null);
            }

            const newSession = await window.LanguageModel.create({
                temperature,
                topK,
                monitor: (monitor) => {
                    monitor.addEventListener("downloadprogress", (e: { loaded?: number }) => {
                        const progress = e.loaded ? Math.round(e.loaded * 100) : 0;
                        setDownloadProgress(progress);
                        setStatusMessage(`Baixando modelo: ${progress}%`);
                    });
                },
            });

            setSession(newSession);
            setStatus('ready');
            setStatusMessage(`Sessão pronta com Temperatura=${temperature} e Top-K=${topK}.`);
            setOutput('');
        } catch (error: any) {
            setStatus('error');
            setStatusMessage(`Erro: ${error.message}`);
            console.error(error);
        }
    }, [session, temperature, topK]);

    const handleSendPrompt = useCallback(async (isStreaming = true) => {
        if (!session || !prompt) return;

        setIsLoading(true);
        setOutput('');
        abortControllerRef.current = new AbortController();

        try {
            if (isStreaming) {
                const stream = session.promptStreaming(prompt, { signal: abortControllerRef.current.signal });
                for await (const chunk of stream) {
                    setOutput(prev => prev + chunk);
                }
            } else {
                const result = await session.prompt(prompt, { signal: abortControllerRef.current.signal });
                setOutput(result);
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                setOutput(prev => prev + `\n\n--- Erro: ${error.message} ---`);
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [session, prompt]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setOutput(prev => prev + '\n\n--- Geração interrompida ---');
        }
    };

    const StatusIndicator = () => {
        const colorClasses = {
            unverified: 'bg-gray-500',
            initializing: 'bg-blue-500 animate-pulse',
            downloading: 'bg-orange-500 animate-pulse',
            ready: 'bg-green-500',
            error: 'bg-red-500',
        };
        return <span className={`w-3 h-3 rounded-full ${colorClasses[status]}`}></span>;
    };

    // --- Renderização do Componente ---
    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">

                {/* Cabeçalho */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                        Gemini Nano Playground
                    </h1>
                    <p className="text-slate-400">Teste a API Prompt diretamente no seu navegador.</p>
                </header>

                <main className="flex flex-col gap-6">
                    {/* Painel de Controle e Status */}
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                            <IconSparkles className="text-purple-400" />
                            Painel de Controle
                        </h2>

                        {/* Status */}
                        <div className="flex items-center gap-3 mb-6 p-3 bg-slate-900 rounded-lg">
                            <StatusIndicator />
                            <span className="text-slate-300 text-sm flex-1">{statusMessage}</span>
                        </div>

                        {status === 'downloading' && (
                            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${downloadProgress}%` }}></div>
                            </div>
                        )}

                        {/* Parâmetros do Modelo */}
                        {modelParams && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="temperature" className="block mb-2 text-sm font-medium text-slate-300">
                                        Temperatura: <span className="font-bold text-cyan-400">{temperature.toFixed(1)}</span>
                                    </label>
                                    <input
                                        id="temperature"
                                        type="range"
                                        min="0.0"
                                        max={modelParams.maxTemperature}
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        disabled={status === 'ready'}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Valores mais altos = mais criativo. Use antes de iniciar.</p>
                                </div>
                                <div>
                                    <label htmlFor="topK" className="block mb-2 text-sm font-medium text-slate-300">
                                        Top-K: <span className="font-bold text-purple-400">{topK}</span>
                                    </label>
                                    <input
                                        id="topK"
                                        type="range"
                                        min="1"
                                        max={modelParams.maxTopK}
                                        step="1"
                                        value={topK}
                                        onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                                        disabled={status === 'ready'}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Altera o conjunto de tokens considerados. Use antes de iniciar.</p>
                                </div>
                            </div>
                        )}

                        {/* Botão de Iniciar/Reiniciar */}
                        <button
                            onClick={handleInitialize}
                            disabled={status === 'initializing' || status === 'downloading'}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {(status === 'initializing' || status === 'downloading') && <IconLoader />}
                            {status === 'ready' ? 'Reiniciar Sessão com Novos Parâmetros' : 'Iniciar Sessão'}
                        </button>
                    </div>

                    {/* Área de Prompt e Geração */}
                    {status === 'ready' && (
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-4">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Digite seu prompt aqui..."
                                rows={4}
                                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => handleSendPrompt(true)}
                                    disabled={isLoading || !prompt}
                                    className="flex-1 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                                >
                                    {isLoading ? <IconLoader /> : 'Enviar (Streaming)'}
                                </button>
                                <button
                                    onClick={handleStop}
                                    disabled={!isLoading}
                                    className="flex-1 sm:flex-initial bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition"
                                >
                                    Parar
                                </button>
                            </div>
                            <div className="mt-4 bg-slate-900 p-4 rounded-lg min-h-[150px] border border-slate-700 whitespace-pre-wrap font-mono text-sm text-slate-300">
                                {output || <span className="text-slate-500">A resposta do modelo aparecerá aqui...</span>}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}