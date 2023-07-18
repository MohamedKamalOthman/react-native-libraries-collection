import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  ar: {
    translation: {
      'Hello world': 'مرحبا بالعالم',
      'Some text goes here, some more text goes here':
        'بعض النص هنا ، المزيد من النص هنا',
      Testing: 'اختبارات',
      'Change language': 'تغيير اللغة',
      'Go to Inner screen ->': 'انتقل إلى الشاشة الداخلية ->',
      Home: 'الصفحة الرئيسية',
      Language: 'لغة',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: I18nManager.isRTL ? 'ar' : 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
