import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ModelParams, ModelStatus, Session } from '../types/gemini';

interface UseGeminiNanoReturn {
    status: ModelStatus;
    statusMessage: string;
    session: Session | null;
    modelParams: ModelParams | null;
    temperature: number;
    topK: number;
    downloadProgress: number;
    isLoading: boolean;
    output: string;
    isApiAvailable: boolean;
    setTemperature: (value: number) => void;
    setTopK: (value: number) => void;
    setOutput: (value: string) => void;
    handleInitialize: () => Promise<void>;
    handleSendPrompt: (prompt: string, isStreaming?: boolean) => Promise<void>;
    handleStop: () => void;
}

export const useGeminiNano = (): UseGeminiNanoReturn => {
    const { t } = useTranslation();
    
    // Estados do hook
    const [status, setStatus] = useState<ModelStatus>('unverified');
    const [statusMessage, setStatusMessage] = useState('');
    const [session, setSession] = useState<Session | null>(null);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isApiAvailable, setIsApiAvailable] = useState(true); // Assumir que está disponível inicialmente

    // Estados para os Parâmetros do Modelo
    const [modelParams, setModelParams] = useState<ModelParams | null>(null);
    const [temperature, setTemperature] = useState(0.4); // Changed default temperature to 0.4
    const [topK, setTopK] = useState(3);

    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);

    // Efeito para definir mensagem inicial de status
    useEffect(() => {
        if (status === 'unverified' && !statusMessage) {
            setStatusMessage(t('status.initialMessage'));
        }
    }, [t, status, statusMessage]);

    // Efeito para verificar se a API está disponível
    useEffect(() => {
        const checkApiAvailability = async () => {
            try {
                // Primeiro, verificar se a API existe
                if (!window.LanguageModel) {
                    setIsApiAvailable(false);
                    return;
                }

                // A API existe, vamos assumir que está disponível
                // Erros específicos serão tratados durante a inicialização
                setIsApiAvailable(true);
            } catch (error) {
                // Se houve erro ao verificar, assumir que não está disponível
                console.error(t('errors.apiAvailabilityCheck'), error);
                setIsApiAvailable(false);
            }
        };
        
        checkApiAvailability();
    }, [t]);

    // Efeito para carregar os parâmetros do modelo ao montar
    useEffect(() => {
        async function fetchParams() {
            if (window.LanguageModel) {
                try {
                    const params = await window.LanguageModel.params();
                    setModelParams(params);
                    // Manter temperatura padrão de 0.4 ao invés de usar params.defaultTemperature
                    // setTemperature(params.defaultTemperature);
                    setTopK(params.defaultTopK);
                } catch (e) {
                    console.error(t('errors.modelParamsLoad'), e);
                }
            }
        }
        fetchParams();
    }, [t]);

    // Função para inicializar o modelo
    const handleInitialize = useCallback(async () => {
        if (!window.LanguageModel) {
            setStatus('error');
            setStatusMessage(t('status.apiNotFound'));
            setIsApiAvailable(false);
            return;
        }

        try {
            setStatus('initializing');
            setStatusMessage(t('status.checkingAvailability'));

            const availability = await window.LanguageModel.availability();

            if (availability === 'unavailable') {
                setStatus('error');
                setStatusMessage(t('status.modelUnavailable'));
                setIsApiAvailable(false);
                return;
            }

            if (availability === 'downloadable' || availability === 'downloading') {
                setStatus('downloading');
                setStatusMessage(t('status.downloading'));
            } else {
                setStatusMessage(t('status.creatingSession'));
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
                        setStatusMessage(t('status.downloadProgress', { progress }));
                    });
                },
            });

            setSession(newSession);
            setStatus('ready');
            setStatusMessage(t('status.sessionReady', { temperature, topK }));
            setOutput('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('status.unknownError');
            setStatus('error');
            setStatusMessage(t('status.error', { message: errorMessage }));
            
            // Se o erro indica que o dispositivo não pode criar uma sessão ou problemas de disponibilidade, marcar API como indisponível
            if (errorMessage.includes('unable to create a session') || 
                errorMessage.includes('Please check the result of availability()') ||
                errorMessage.includes('device is unable') ||
                errorMessage.includes('availability()')) {
                setIsApiAvailable(false);
            }
            
            console.error(error);
        }
    }, [session, temperature, topK, t]);

    // Função para enviar prompt
    const handleSendPrompt = useCallback(async (prompt: string, isStreaming = true) => {
        if (!session || !prompt) return;

        setIsLoading(true);
        setOutput('');
        abortControllerRef.current = new AbortController();

        try {
            if (isStreaming) {
                const stream = session.promptStreaming(prompt, { signal: abortControllerRef.current.signal });
                const reader = stream.getReader();
                
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        setOutput(prev => prev + value);
                    }
                } finally {
                    reader.releaseLock();
                }
            } else {
                const result = await session.prompt(prompt, { signal: abortControllerRef.current.signal });
                setOutput(result);
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
                setOutput(prev => prev + `\n\n--- ${t('output.error', { message: error.message })} ---`);
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [session, t]);

    // Função para parar a geração
    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setOutput(prev => prev + `\n\n--- ${t('output.interrupted')} ---`);
        }
    }, [t]);

    return {
        status,
        statusMessage,
        session,
        modelParams,
        temperature,
        topK,
        downloadProgress,
        isLoading,
        output,
        isApiAvailable,
        setTemperature,
        setTopK,
        setOutput,
        handleInitialize,
        handleSendPrompt,
        handleStop,
    };
};
