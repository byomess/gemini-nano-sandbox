import '@testing-library/jest-dom';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Basic mock, returns the key itself
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
  // If you use Trans component
  // Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));
