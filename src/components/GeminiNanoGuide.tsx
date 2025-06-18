import React from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from './MarkdownRenderer';

const GeminiNanoGuide: React.FC = () => {
    const { t } = useTranslation();

    const CodeBlock: React.FC<{ contentKey: string }> = ({ contentKey }) => {
        const content = t(contentKey);
        // Ensure backticks are correctly interpreted by wrapping with markdown if not already
        const markdownContent = content.startsWith('```') && content.endsWith('```')
            ? content
            : '```javascript\n' + content + '\n```';
        return <MarkdownRenderer content={markdownContent} />;
    };

    const Paragraph: React.FC<{ contentKey: string, className?: string }> = ({ contentKey, className }) => (
        <p className={`text-slate-400 leading-relaxed mb-4 ${className || ''}`}>
            {t(contentKey)}
        </p>
    );

    const SectionTitle: React.FC<{ contentKey: string }> = ({ contentKey }) => (
        <h3 className="text-xl font-semibold text-slate-200 mb-4 mt-6">
            {t(contentKey)}
        </h3>
    );

    const SubSectionTitle: React.FC<{ contentKey: string }> = ({ contentKey }) => (
        <h4 className="text-lg font-semibold text-purple-300 mb-3 mt-4">
            {t(contentKey)}
        </h4>
    );

    const ListItem: React.FC<{ contentKey: string }> = ({ contentKey }) => (
        <li dangerouslySetInnerHTML={{ __html: t(contentKey) }} />
    );

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl h-full overflow-y-auto text-sm">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 mb-8 text-center">
                {t('guide.title')}
            </h2>

            {/* Section 1: Introduction */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section1.title" />
                <Paragraph contentKey="guide.section1.paragraph1" />
            </section>

            {/* Section 2: What is Gemini Nano? */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section2.title" />
                <Paragraph contentKey="guide.section2.paragraph1" />
                <Paragraph contentKey="guide.section2.paragraph2" />
            </section>

            {/* Section 3: Key Features */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section3.title" />
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2">
                    <ListItem contentKey="guide.section3.listItem1" />
                    <ListItem contentKey="guide.section3.listItem2" />
                    <ListItem contentKey="guide.section3.listItem3" />
                    <ListItem contentKey="guide.section3.listItem4" />
                </ul>
            </section>

            {/* Section 4: How to Use This Playground */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section4.title" />
                <Paragraph contentKey="guide.section4.paragraph1" />
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 mb-4">
                    <ListItem contentKey="guide.section4.listItem1" />
                    <ListItem contentKey="guide.section4.listItem2" />
                    <ListItem contentKey="guide.section4.listItem3" />
                </ul>
                <Paragraph contentKey="guide.section4.paragraph2" />
            </section>

            {/* Section 5: Important Considerations */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section5.title" />
                <Paragraph contentKey="guide.section5.paragraph1" />
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2">
                    <ListItem contentKey="guide.section5.listItem1" />
                    <ListItem contentKey="guide.section5.listItem2" />
                    <ListItem contentKey="guide.section5.listItem3" />
                    <ListItem contentKey="guide.section5.listItem4" />
                </ul>
            </section>

            <hr className="border-slate-600 my-8" />

            {/* Section 6: Checking API Availability */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section6.title" />
                <Paragraph contentKey="guide.section6.paragraph1" />
                <Paragraph contentKey="guide.section6.paragraph2" />
                <Paragraph contentKey="guide.section6.codeBlock1_Description" className="text-slate-300 font-medium mb-2" />
                <CodeBlock contentKey="guide.section6.codeBlock1" />
            </section>

            {/* Section 7: Creating a Model Session & Parameters */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section7.title" />
                <Paragraph contentKey="guide.section7.paragraph1" />
                <SubSectionTitle contentKey="guide.section7.subsection1_title" />
                <Paragraph contentKey="guide.section7.subsection1_paragraph1" />
                <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 mb-4">
                    <ListItem contentKey="guide.section7.subsection1_listItem1" />
                    <ListItem contentKey="guide.section7.subsection1_listItem2" />
                </ul>
                <Paragraph contentKey="guide.section7.subsection1_paragraph2" />
                <Paragraph contentKey="guide.section7.codeBlock1_Description" className="text-slate-300 font-medium mb-2" />
                <CodeBlock contentKey="guide.section7.codeBlock1" />
            </section>

            {/* Section 8: Sending Prompts */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section8.title" />
                <Paragraph contentKey="guide.section8.paragraph1" />

                <SubSectionTitle contentKey="guide.section8.subsection1_title" />
                <Paragraph contentKey="guide.section8.subsection1_paragraph1" />
                <Paragraph contentKey="guide.section8.codeBlock1_Description" className="text-slate-300 font-medium mb-2" />
                <CodeBlock contentKey="guide.section8.codeBlock1" />

                <SubSectionTitle contentKey="guide.section8.subsection2_title" />
                <Paragraph contentKey="guide.section8.subsection2_paragraph1" />
                <Paragraph contentKey="guide.section8.codeBlock2_Description" className="text-slate-300 font-medium mb-2" />
                <CodeBlock contentKey="guide.section8.codeBlock2" />
            </section>

            {/* Section 9: Model Downloads */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section9.title" />
                <Paragraph contentKey="guide.section9.paragraph1" />
                <Paragraph contentKey="guide.section9.paragraph2" />
                <Paragraph contentKey="guide.section9.paragraph3" />
            </section>

            {/* Section 10: Error Handling */}
            <section className="mb-8">
                <SectionTitle contentKey="guide.section10.title" />
                <Paragraph contentKey="guide.section10.paragraph1" />
                <Paragraph contentKey="guide.section10.paragraph2" />
                <Paragraph contentKey="guide.section10.codeBlock1_Description" className="text-slate-300 font-medium mb-2" />
                <CodeBlock contentKey="guide.section10.codeBlock1" />
                <Paragraph contentKey="guide.section10.paragraph3" />
            </section>

        </div>
    );
};

export default GeminiNanoGuide;
