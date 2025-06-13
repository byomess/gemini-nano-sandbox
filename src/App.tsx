import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ControlPanelHeader,
    LanguageSelector,
    ModelControls,
    OutputDisplay,
    PromptInterface,
    SetupModal,
    StatusDisplay
} from './components';
import { useGeminiNano } from './hooks/useGeminiNano';

// --- Componente Principal da Aplicação ---
export default function App() {
    const { t } = useTranslation();
    
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
    };    // --- Renderização do Componente ---
    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 min-h-screen font-sans flex flex-col relative overflow-hidden">
            {/* Elementos de fundo animados */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Seletor de Idioma - Fixo na borda superior direita */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageSelector />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 flex-grow relative z-10">

                {/* Cabeçalho */}
                <header className="text-center mb-8 md:mb-12">
                    <div className="relative">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 mb-4">
                            {t('header.title')}
                        </h1>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 opacity-5 blur-lg -z-10"></div>
                    </div>
                    <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {t('header.subtitle')}
                    </p>
                    
                    {/* Indicador de status da API */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className={`w-2 h-2 rounded-full ${isApiAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                        <span className={`text-sm ${isApiAvailable ? 'text-green-400' : 'text-red-400'}`}>
                            {isApiAvailable ? 'API Disponível' : 'API Indisponível'}
                        </span>
                    </div>
                </header>

                <main className="flex flex-col lg:flex-row gap-6 md:gap-8 flex-grow">
                    {/* Painel de Controle e Status - Sidebar no desktop */}
                    <div className="lg:w-80 xl:w-96 space-y-6">
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
                            {/* Efeito de brilho */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                            
                            {/* Header do Painel de Controle */}
                            <ControlPanelHeader />
                            
                            {/* Status */}
                            <StatusDisplay status={status} statusMessage={statusMessage} />

                            {/* Controles do Modelo */}
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
                    </div>

                    {/* Área Principal - Chat Interface */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {status === 'ready' && (
                            <div className="flex flex-col gap-6 h-full">
                                {/* Interface de Prompt */}
                                <PromptInterface
                                    prompt={prompt}
                                    isLoading={isLoading}
                                    onPromptChange={setPrompt}
                                    onSendPrompt={handlePromptSend}
                                    onStop={handleStop}
                                />
                                
                                {/* Output Display */}
                                <OutputDisplay output={output} />
                            </div>
                        )}

                        {/* Mensagem quando não está pronto */}
                        {status !== 'ready' && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="text-6xl mb-4 animate-pulse">🤖</div>
                                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                                        {status === 'downloading' ? 'Baixando modelo...' : 
                                         status === 'initializing' ? 'Inicializando...' : 
                                         'Configure o Gemini Nano'}
                                    </h3>
                                    <p className="text-slate-500">
                                        {status === 'downloading' ? 'O modelo está sendo baixado em segundo plano.' :
                                         status === 'initializing' ? 'Preparando a IA para uso.' :
                                         'Clique em "Iniciar" no painel lateral para começar.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Rodapé */}
                <footer className="mt-12 text-center text-sm text-slate-500 relative">
                    <div className="max-w-2xl mx-auto">
                        <p className="mb-2">{t('footer.description')}</p>
                        <div className="flex items-center justify-center gap-4 text-xs">
                            <span>Powered by Gemini Nano</span>
                            <span>•</span>
                            <span>Built with React + TypeScript</span>
                        </div>
                    </div>
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