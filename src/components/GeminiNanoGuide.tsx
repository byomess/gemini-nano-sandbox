import React from 'react';
import { useTranslation } from 'react-i18next';

const GeminiNanoGuide: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 mb-6 text-center">
                {t('guide.title')}
            </h2>

            <section className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {t('guide.section1.title')}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                    {t('guide.section1.paragraph1')}
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {t('guide.section2.title')}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                    {t('guide.section2.paragraph1')}
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                    {t('guide.section2.paragraph2')}
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {t('guide.section3.title')}
                </h3>
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2">
                    <li>{t('guide.section3.listItem1')}</li>
                    <li>{t('guide.section3.listItem2')}</li>
                    <li>{t('guide.section3.listItem3')}</li>
                    <li>{t('guide.section3.listItem4')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {t('guide.section4.title')}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                    {t('guide.section4.paragraph1')}
                </p>
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 mb-4">
                    <li>{t('guide.section4.listItem1')}</li>
                    <li>{t('guide.section4.listItem2')}</li>
                    <li>{t('guide.section4.listItem3')}</li>
                </ul>
                <p className="text-slate-400 leading-relaxed">
                    {t('guide.section4.paragraph2')}
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {t('guide.section5.title')}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                    {t('guide.section5.paragraph1')}
                </p>
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2">
                    <li>{t('guide.section5.listItem1')}</li>
                    <li>{t('guide.section5.listItem2')}</li>
                    <li>{t('guide.section5.listItem3')}</li>
                    <li>{t('guide.section5.listItem4')}</li>
                </ul>
            </section>
        </div>
    );
};

export default GeminiNanoGuide;
