import i18n from 'i18next';
import languages from './locales/languages';

i18n
  .init({
    fallbackLng: 'zh',
    ns: ['common'],
    defaultNS: 'common',
    debug: true,
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      },
    },
  });

Object.keys(languages).map(lang => {
  i18n.addResourceBundle(lang, 'common', languages[lang], true)
});

export default i18n;
