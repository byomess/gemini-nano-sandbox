import { useEffect, useState } from 'react';
import {
    ModelControls,
    OutputDisplay,
    PromptInterface,
    SetupModal,
    StatusDisplay
} from './components';
import { IconSparkles } from './components/Icons';
import { useGeminiNano } from './hooks/useGeminiNano';

// --- Componente Principal da Aplicação ---
export default function App() {
    // Hook customizado com toda a lógica do Gemini Nano
    const {
        status,
        statusMessage,
        modelParams,
        temperature,
        topK,
        downloadProgress,
        isLoading,
        output,
        isApiAvailable,
        setTemperature,
        setTopK,
        handleInitialize,
        handleSendPrompt,
        handleStop,
    } = useGeminiNano();

    // Estado local para o prompt e modal
    const [prompt, setPrompt] = useState('');
    const [showSetupModal, setShowSetupModal] = useState(false);

    // Efeito para mostrar o modal quando a API não estiver disponível ou houver erro específico
    useEffect(() => {
        // Verificar se deve mostrar o modal baseado na API ou em erros específicos
        const shouldShowModal = !isApiAvailable || 
            (status === 'error' && (
                statusMessage.includes('unable to create a session') ||
                statusMessage.includes('Please check the result of availability()') ||
                statusMessage.includes('device is unable') ||
                statusMessage.includes('availability()') ||
                statusMessage.includes('API LanguageModel não encontrada')
            ));

        // Dar um pequeno delay para evitar flash do modal durante a verificação inicial
        const timer = setTimeout(() => {
            if (shouldShowModal) {
                setShowSetupModal(true);
            } else {
                // Se a API ficar disponível, fechar o modal
                setShowSetupModal(false);
            }
        }, 1000); // Reduzir para 1 segundo para resposta mais rápida

        return () => clearTimeout(timer);
    }, [isApiAvailable, status, statusMessage]);

    // Efeito adicional para fechar o modal imediatamente se a API ficar disponível
    useEffect(() => {
        if (isApiAvailable && showSetupModal) {
            setShowSetupModal(false);
        }
    }, [isApiAvailable, showSetupModal]);

    // Função para enviar prompt
    const handlePromptSend = () => {
        handleSendPrompt(prompt, true);
    };

    // --- Renderização do Componente ---
    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans flex flex-col">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 flex-grow">

                {/* Cabeçalho */}
                <header className="text-center mb-6 md:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                        Gemini Nano Playground
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">Teste a API Prompt diretamente no seu navegador.</p>
                </header>

                <main className="flex flex-col gap-4 md:gap-6 flex-grow">
                    {/* Painel de Controle e Status */}
                    <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 sm:gap-3">
                            <IconSparkles className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                            Painel de Controle
                        </h2>

                        {/* Status */}
                        <StatusDisplay status={status} statusMessage={statusMessage} />

                        <ModelControls
                            status={status}
                            modelParams={modelParams}
                            temperature={temperature}
                            topK={topK}
                            downloadProgress={downloadProgress}
                            onTemperatureChange={setTemperature}
                            onTopKChange={setTopK}
                            onInitialize={handleInitialize}
                        />
                    </div>

                    {/* Área de Prompt e Geração */}
                    {status === 'ready' && (
                        <div className="flex flex-col gap-4 flex-grow">
                            <PromptInterface
                                prompt={prompt}
                                isLoading={isLoading}
                                onPromptChange={setPrompt}
                                onSendPrompt={handlePromptSend}
                                onStop={handleStop}
                            />
                            <OutputDisplay output={output} />
                        </div>
                    )}
                </main>

                {/* Rodapé */}
                <footer className="mt-8 text-center text-xs text-slate-500">
                    <p>Gemini Nano - Modelo de linguagem executado diretamente no navegador</p>
                </footer>
            </div>

            {/* Modal de Setup */}
            <SetupModal 
                isOpen={showSetupModal} 
                onClose={() => setShowSetupModal(false)}
                onRetry={handleInitialize}
            />
        </div>
    );
}