import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSettings } from './Icons';

export const ControlPanelHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg shrink-0">
                <IconSettings className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">{t('controls.title')}</h2>
                <p className="text-sm text-slate-400">{t('controls.subtitle')}</p>
            </div>
        </div>
    );
};
