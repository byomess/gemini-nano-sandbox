import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconAlertTriangle,
    IconCheck,
    IconCopy,
    IconCpu,
    IconDownload,
    IconHardDrive,
    IconInfo,
    IconLink,
    IconMonitor,
    IconPackage,
    IconRefresh,
    IconRocket,
    IconRotate,
    IconSearch,
    IconSettings,
    IconTarget,
    IconWifi,
    IconWrench,
    IconX
} from './Icons';

interface SetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry?: () => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onRetry }) => {
    const { t } = useTranslation();
    const [copiedText, setCopiedText] = useState<string>('');

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setTimeout(() => setCopiedText(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const CopyButton = ({ text, className = "" }: { text: string; className?: string }) => (
        <button
            onClick={() => copyToClipboard(text)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all duration-200 ${className}`}
            title={t('setupModal.copyToClipboard')}
        >
            {copiedText === text ? (
                <span className="text-green-400 text-xs flex items-center"><IconCheck size={16} /></span>
            ) : (
                <span className="text-sm flex items-center"><IconCopy size={16} /></span>
            )}
        </button>
    );

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300 overflow-hidden"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-600/50 shadow-2xl custom-scrollbar animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/70 p-4 sm:p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                        <IconRocket className="text-purple-400 animate-bounce w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {t('setupModal.title')}
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                        aria-label={t('setupModal.closeModalLabel')}
                    >
                        <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                    {/* Alert Message */}
                    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/50 rounded-xl p-4 sm:p-5 shadow-lg">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <IconAlertTriangle className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-amber-100 mb-1 sm:mb-2">
                                    {t('setupModal.alert.title')}
                                </h3>
                                <p className="text-amber-200/90 leading-relaxed text-sm sm:text-base">
                                    {t('setupModal.alert.description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 sm:p-6 rounded-lg border border-blue-700/50">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                            <IconInfo className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                            {t('setupModal.introduction.title')}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                            {t('setupModal.introduction.description')}
                        </p>
                    </div>

                    {/* Requirements */}
                    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 p-4 sm:p-6 rounded-xl border border-amber-500/30 shadow-lg">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                            <IconAlertTriangle className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5" />
                            {t('setupModal.requirements.title')}
                        </h3>
                        <div className="grid gap-2 sm:gap-3 text-slate-200">
                            <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 sm:p-3 rounded-lg">
                                <IconMonitor className="text-green-400 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="text-sm sm:text-base">
                                    <strong className="text-white">{t('setupModal.requirements.osLabel')}</strong> {t('setupModal.requirements.osValue')}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 sm:p-3 rounded-lg">
                                <IconHardDrive className="text-blue-400 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="text-sm sm:text-base">
                                    <strong className="text-white">{t('setupModal.requirements.storageLabel')}</strong> {t('setupModal.requirements.storageValue')}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 sm:p-3 rounded-lg">
                                <IconCpu className="text-purple-400 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="text-sm sm:text-base">
                                    <strong className="text-white">{t('setupModal.requirements.gpuLabel')}</strong> {t('setupModal.requirements.gpuValue')}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 sm:p-3 rounded-lg">
                                <IconWifi className="text-green-400 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="text-sm sm:text-base">
                                    <strong className="text-white">{t('setupModal.requirements.networkLabel')}</strong> {t('setupModal.requirements.networkValue')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Get Chrome */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">1</span>
                            {t('setupModal.steps.step1.title')}
                        </h3>
                        <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg">
                            <p className="text-slate-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                {t('setupModal.steps.step1.description')}
                            </p>
                            <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3">
                                <a
                                    href="https://www.google.com/chrome/canary/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 text-sm sm:text-base"
                                >
                                    <IconDownload className="w-4 h-4" />
                                    {t('setupModal.steps.step1.downloadCanary')}
                                </a>
                                <a
                                    href="https://www.google.com/chrome/dev/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                                >
                                    <IconSettings className="w-4 h-4" />
                                    {t('setupModal.steps.step1.downloadDev')}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Enable Flags */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">2</span>
                            {t('setupModal.steps.step2.title')}
                        </h3>
                        
                        <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <IconLink className="text-cyan-400 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex-1">
                                    <p className="text-slate-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                                        {t('setupModal.steps.step2.chromeFlags')}
                                    </p>
                                    <div className="bg-slate-900 p-2 sm:p-3 rounded border border-slate-600 font-mono text-xs sm:text-sm relative">
                                        <code className="text-cyan-400">chrome://flags</code>
                                        <CopyButton text="chrome://flags" className="sm:p-1.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <IconTarget className="text-green-400 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex-1">
                                    <p className="text-slate-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                                        <strong>{t('setupModal.steps.step2.enableApi')}</strong>
                                    </p>
                                    <div className="bg-slate-900 p-2 sm:p-3 rounded border border-slate-600 font-mono text-xs sm:text-sm mb-2 relative">
                                        <code className="text-purple-400">#prompt-api-for-gemini-nano</code>
                                        <CopyButton text="#prompt-api-for-gemini-nano" className="sm:p-1.5" />
                                    </div>
                                    <p className="text-slate-400 text-xs sm:text-sm">{t('setupModal.steps.step2.setFlagToEnabled')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <IconRotate className="text-yellow-400 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                                <div>
                                    <p className="text-slate-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                                        <strong>{t('setupModal.steps.step2.restart')}</strong>
                                    </p>
                                    <p className="text-slate-400 text-xs sm:text-sm">
                                        {t('setupModal.steps.step2.relaunchDescription')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: CPU Bypass (Optional) */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                            <span className="bg-orange-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">3</span>
                            {t('setupModal.steps.step3.title')}
                        </h3>
                        
                        <div className="bg-orange-900/20 p-3 sm:p-4 rounded-lg border border-orange-600/50">
                            <p className="text-orange-200 mb-3 sm:mb-4 text-sm sm:text-base">
                                <strong>{t('setupModal.steps.step3.description')}</strong>
                            </p>
                            
                            <div className="bg-slate-900 p-2 sm:p-3 rounded border border-slate-600 font-mono text-xs sm:text-sm mb-3 relative overflow-x-auto whitespace-nowrap">
                                <code className="text-orange-400">#optimization-guide-on-device-model-execution-bypass</code>
                                <CopyButton text="#optimization-guide-on-device-model-execution-bypass" className="sm:p-1.5" />
                            </div>
                            
                            <div className="space-y-1.5 sm:space-y-2 text-orange-200 text-xs sm:text-sm">
                                <p className="flex items-center gap-2">
                                    <IconCheck className="text-orange-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {t('setupModal.steps.step3.searchFlag')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <IconCheck className="text-orange-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {t('setupModal.steps.step3.ignoreGpu')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <IconCheck className="text-orange-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {t('setupModal.steps.step3.performance')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Verification */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">4</span>
                            {t('setupModal.steps.step4.title')}
                        </h3>
                        
                        <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <IconSearch className="text-blue-400 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex-1">
                                    <p className="text-slate-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                                        {t('setupModal.steps.step4.devtools')}
                                    </p>
                                    <div className="bg-slate-900 p-2 sm:p-3 rounded border border-slate-600 font-mono text-xs sm:text-sm relative">
                                        <code className="text-green-400">await LanguageModel.availability()</code>
                                        <CopyButton text="await LanguageModel.availability()" className="sm:p-1.5" />
                                    </div>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
                                        {t('setupModal.steps.step4.shouldReturn')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3">
                                <IconPackage className="text-purple-400 mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex-1">
                                    <p className="text-slate-300 mb-1.5 sm:mb-2 text-sm sm:text-base">
                                        {t('setupModal.steps.step4.checkDownload')}
                                    </p>
                                    <div className="bg-slate-900 p-2 sm:p-3 rounded border border-slate-600 font-mono text-xs sm:text-sm relative">
                                        <code className="text-cyan-400">chrome://components</code>
                                        <CopyButton text="chrome://components" className="sm:p-1.5" />
                                    </div>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
                                        {t('setupModal.steps.step4.lookFor')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting */}
                    <div className="bg-red-900/20 p-3 sm:p-5 rounded-lg border border-red-600/50">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                            <IconWrench className="text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
                            {t('setupModal.troubleshooting.title')}
                        </h3>
                        <div className="space-y-2 sm:space-y-3 text-red-200 text-xs sm:text-sm">
                            <div className="flex items-start gap-2">
                                <IconX className="text-red-400 mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <div>
                                    {t('setupModal.troubleshooting.apiNotFound')}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <IconX className="text-red-400 mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <div>
                                    {t('setupModal.troubleshooting.modelUnavailable')}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <IconX className="text-red-400 mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <div>
                                    {t('setupModal.troubleshooting.downloadProblems')}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <IconX className="text-red-400 mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <div>
                                    {t('setupModal.troubleshooting.stillNotWorking')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 sm:pt-6 border-t border-slate-700">
                        <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
                            {t('setupModal.footer.documentation')} 
                            <a 
                                href="https://developer.chrome.com/docs/ai/get-started" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 ml-1"
                            >
                                {t('setupModal.footer.documentationLink')}
                            </a>
                        </p>
                        <div className="flex flex-col xs:flex-row justify-center gap-3">
                            <button
                                onClick={onClose}
                                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-semibold transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <IconRocket className="w-4 h-4" /> {t('setupModal.footer.understood')}
                            </button>
                            {onRetry && (
                                <button
                                    onClick={() => {
                                        onRetry();
                                        onClose();
                                    }}
                                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-semibold transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                                                    >
                                                                        <IconRefresh className="w-4 h-4" /> {t('setupModal.footer.tryAgain')}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    };
