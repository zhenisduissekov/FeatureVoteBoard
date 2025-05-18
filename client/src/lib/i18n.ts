import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  header: {
    title: 'FeatureVote',
    addFeature: 'Add Feature',
    language: 'Language'
  },
  hero: {
    title: 'Build <highlight>better features</highlight> from user feedback',
    subtitle: 'Drive your product\'s growth with clarity by letting users vote on the features they want. 🚀',
    ideasBoard: 'Ideas Board',
    sortBy: 'Sort by',
    filterBy: 'Filter by'
  },
  featureStatus: {
    pending: 'Pending',
    'in-progress': 'In Progress',
    approved: 'Approved',
    done: 'Done',
    canceled: 'Canceled',
    all: 'All Statuses'
  },
  sortOptions: {
    'most-voted': 'Most Voted',
    newest: 'Newest',
    oldest: 'Oldest'
  },
  featureList: {
    noFeatures: 'No features found',
    beFirst: 'Be the first to suggest a feature!',
    submitted: 'Submitted'
  },
  addFeatureModal: {
    title: 'Submit new feature idea',
    featureTitle: 'Title',
    titleRequired: 'Title *',
    descriptionOptional: 'Description (optional)',
    titlePlaceholder: 'What feature would you like to see?',
    descriptionPlaceholder: 'Provide more details about your idea...',
    cancel: 'Cancel',
    submit: 'Submit idea',
    titleError: 'Please enter a title (minimum 3 characters)'
  },
  voting: {
    alreadyVoted: 'Already Voted',
    voteSuccess: 'Vote Submitted',
    voteRecorded: 'Your vote has been recorded.'
  },
  footer: {
    copyright: '© 2023 FeatureVote. All rights reserved.',
    educational: 'Built for educational purposes only.'
  },
  toasts: {
    success: 'Success!',
    featureSubmitted: 'Your feature idea has been submitted.',
    error: 'Error'
  }
};

// Russian translations
const ruTranslations = {
  header: {
    title: 'Голосование за функцию',
    addFeature: 'Добавить функцию',
    language: 'Язык'
  },
  hero: {
    title: 'Создавайте <highlight>лучшие функции</highlight> на основе отзывов пользователей',
    subtitle: 'Ускорьте рост вашего продукта, позволяя пользователям голосовать за нужные функции. 🚀',
    ideasBoard: 'Доска идей',
    sortBy: 'Сортировать по',
    filterBy: 'Фильтровать по'
  },
  featureStatus: {
    pending: 'В ожидании',
    'in-progress': 'В процессе',
    approved: 'Одобрено',
    done: 'Завершено',
    canceled: 'Отменено',
    all: 'Все статусы'
  },
  sortOptions: {
    'most-voted': 'Популярные',
    newest: 'Новые',
    oldest: 'Старые'
  },
  featureList: {
    noFeatures: 'Функции не найдены',
    beFirst: 'Будьте первым, кто предложит функцию!',
    submitted: 'Добавлено'
  },
  addFeatureModal: {
    title: 'Предложить новую идею функции',
    featureTitle: 'Заголовок',
    titleRequired: 'Заголовок *',
    descriptionOptional: 'Описание (необязательно)',
    titlePlaceholder: 'Какую функцию вы хотели бы видеть?',
    descriptionPlaceholder: 'Предоставьте больше деталей о вашей идее...',
    cancel: 'Отмена',
    submit: 'Отправить идею',
    titleError: 'Пожалуйста, введите заголовок (минимум 3 символа)'
  },
  voting: {
    alreadyVoted: 'Уже проголосовали',
    voteSuccess: 'Голос отправлен',
    voteRecorded: 'Ваш голос записан.'
  },
  footer: {
    copyright: '© 2023 ГолосФункций. Все права защищены.',
    educational: 'Создано в образовательных целях.'
  },
  toasts: {
    success: 'Успех!',
    featureSubmitted: 'Ваша идея функции была отправлена.',
    error: 'Ошибка'
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ru: {
        translation: ruTranslations
      }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;