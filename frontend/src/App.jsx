import React, { useState, useEffect } from 'react';
import api from './utils/api';
import { Plus, Settings, X } from 'react-feather';
import FeatureList from './components/FeatureList';
import AddFeatureModal from './components/AddFeatureModal';
import './index.css';
import './App.css';

// Simple translation dictionary
const translations = {
  en: {
    title: 'Build better features from user feedback',
    subtitle: 'Drive your product\'s growth with clarity by letting users vote on the features they want. 🚀',
    addFeature: 'Add Feature',
    ideasBoard: 'Ideas Board',
    mostVoted: 'Most Voted',
    newest: 'Newest',
    all: 'All',
    adminPanel: 'Admin Panel',
    close: 'Close',
    noFeatures: 'No features have been suggested yet.',
    noFeaturesTitle: 'No features yet',
    loading: 'Loading features...',
    pleaseWait: 'Just a moment while we fetch the latest suggestions.',
    submitting: 'Submitting...',
    error: 'An error occurred. Please try again.',
    retry: 'Retry',
    copyright: '© 2023 FeatureVote. All rights reserved.',
    builtWith: 'Built with ❤️ for better products',
    suggestNewFeature: 'Suggest a New Feature',
    featureTitle: 'Feature Title',
    whatWouldYouLikeToSee: 'What would you like to see?',
    description: 'Description',
    tellUsMore: 'Tell us more about your suggestion (optional)',
    beClearAndConcise: 'Be clear and concise. What problem does this solve?',
    category: 'Category',
    selectCategory: 'Select a category',
    createNewCategory: 'Create new category',
    enterNewCategoryName: 'Enter new category name',
    cancel: 'Cancel',
    submit: 'Submit',
    noFeaturesInCategoryTitle: 'No features yet',
    noFeaturesInCategory: 'There are no features in this category yet.',
    beTheFirst: 'Be the first to suggest a feature in this category!'
  },
  ru: {
    title: 'Создавайте лучшие функции на основе отзывов',
    subtitle: 'Развивайте свой продукт, позволяя пользователям голосовать за нужные функции. 🚀',
    addFeature: 'Добавить функцию',
    ideasBoard: 'Доска идей',
    mostVoted: 'Самые популярные',
    newest: 'Новые',
    all: 'Все',
    adminPanel: 'Панель администратора',
    close: 'Закрыть',
    noFeatures: 'Пока нет предложений.',
    noFeaturesTitle: 'Пока нет функций',
    loading: 'Загружаем функции...',
    pleaseWait: 'Подождите немного, пока мы загружаем последние предложения.',
    submitting: 'Отправка...',
    error: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
    retry: 'Повторить',
    copyright: '© 2023 FeatureVote. Все права защищены.',
    builtWith: 'Создано с ❤️ для лучших продуктов',
    suggestNewFeature: 'Предложить новую функцию',
    featureTitle: 'Название функции',
    whatWouldYouLikeToSee: 'Что бы вы хотели увидеть?',
    description: 'Описание',
    tellUsMore: 'Расскажите подробнее о вашем предложении (необязательно)',
    beClearAndConcise: 'Будьте краткими. Какую проблему это решает?',
    category: 'Категория',
    selectCategory: 'Выберите категорию',
    createNewCategory: 'Создать новую категорию',
    enterNewCategoryName: 'Введите название категории',
    cancel: 'Отмена',
    submit: 'Отправить',
    noFeaturesInCategoryTitle: 'Пока нет функций',
    noFeaturesInCategory: 'В этой категории пока нет функций.',
    beTheFirst: 'Будьте первым, кто предложит функцию в этой категории!'
  }
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8088';
const API_URL = `${API_BASE.replace(/\/+$/, '')}/api`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const t = translations[language]; // Translation helper

  const fetchFeatures = async (category = '') => {
    try {
      setIsLoading(true);
      const params = category && category !== 'All' ? { category } : {};
      const response = await api.get('/features', { params });
      
      // Always update the features list
      const allFeatures = response.data;
      setFeatures(allFeatures);
      
      // Update categories if needed
      if (isInitialLoad) {
        const uniqueCategories = ['All'];
        allFeatures.forEach(feature => {
          if (feature.category && !uniqueCategories.includes(feature.category)) {
            uniqueCategories.push(feature.category);
          }
        });
        setCategories(uniqueCategories);
        setIsInitialLoad(false);
      }
      
      // Filter features based on the selected category
      const filtered = category && category !== 'All' 
        ? allFeatures.filter(f => f.category === category)
        : allFeatures;
        
      setFilteredFeatures(filtered);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching features:', err);
      setError(err.response?.data?.message || t.error);
      setIsLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Filter existing features instead of making a new API call
    if (category === 'All') {
      setFilteredFeatures([...features]);
    } else {
      setFilteredFeatures(features.filter(f => f.category === category));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFeature = async (featureData) => {
    // Prevent duplicate titles (case-insensitive)
    if (features.some(f => f.title.trim().toLowerCase() === featureData.title.trim().toLowerCase())) {
      setError('A feature with this title already exists. Please use a unique title.');
      return;
    }
    try {
      const response = await api.post('/features', {
        title: featureData.title,
        description: featureData.description || '',
        category: featureData.category || 'Uncategorized'
      });
      // Add the new feature and update the filtered list
      const updatedFeatures = [...features, response.data];
      setFeatures(updatedFeatures);
      
      // Update categories if this is a new category
      if (response.data.category && !categories.includes(response.data.category)) {
        setCategories([...categories, response.data.category]);
      }
      
      // Update filtered features based on current category
      if (selectedCategory === 'All' || selectedCategory === response.data.category) {
        setFilteredFeatures(prev => [...prev, response.data]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding feature:', err);
      setError(err.response?.data?.message || t.error);
    }
  };

  // Track voted features in localStorage
  const [votedFeatures, setVotedFeatures] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('votedFeatures') || '[]');
    } catch {
      return [];
    }
  });

  const handleVote = async (id) => {
    if (votedFeatures.includes(id)) return; // Prevent multiple votes
    try {
      await api.post(`/features/${id}/vote`, {});
      setVotedFeatures(prev => {
        const updated = [...prev, id];
        localStorage.setItem('votedFeatures', JSON.stringify(updated));
        return updated;
      });
      fetchFeatures();
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.response?.data?.message || t.error);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleAdminPanel = () => {
    setIsAdminOpen(!isAdminOpen);
  };



  return (
    <div className="app">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <img src="/favicon.ico" alt="FeatureVote logo" className="nav-logo fixed-size" />
          <span className="nav-title">FeatureVote</span>
        </div>
        <div className="nav-right">
          <button 
            className={`nav-user ${isAdminOpen ? 'active' : ''}`}
            onClick={toggleAdminPanel}
            aria-label="Toggle admin panel"
            aria-expanded={isAdminOpen}
          >
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1 className="main-title">
            {t.title.split('better features')[0]}<span className="highlight">better features</span>{t.title.split('better features')[1]}
          </h1>
          <p className="main-subtitle">
            {t.subtitle}
          </p>

          <div className="add-feature-container">
            <button
              className="add-feature-button"
              onClick={() => setIsModalOpen(true)}
              aria-label={t.addFeature}
            >
              <Plus size={18} />
              <span>{t.addFeature}</span>
            </button>
          </div>
        </header>
        {/* Board header */}
        <div className="board-header">
          <h2 className="board-title">{t.ideasBoard}</h2>
        </div>
        {/* Feature grid */}
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <div className="loading">{t.loading}</div>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button 
              onClick={fetchFeatures}
              className="retry-button"
            >
              {t.retry}
            </button>
          </div>
        ) : (
          <FeatureList 
            features={filteredFeatures} 
            onVote={handleVote} 
            emptyStateText={t.noFeatures}
            votedFeatures={votedFeatures}
            t={t}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            categories={categories}
            isLoading={isLoading}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-left">
          <img src="/favicon.ico" alt="FeatureVote logo" className="footer-logo" />
          <span>{t.copyright}</span>
        </div>
        <div className="footer-right">
          Built for educational purposes only.
        </div>
      </footer>

      <AddFeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFeature={handleAddFeature}
        t={t}
        addButtonText={t.addFeature}
      />
      
      {/* Admin Panel Overlay */}
      <div className={`admin-overlay ${isAdminOpen ? 'active' : ''}`} onClick={toggleAdminPanel}></div>
      
      {/* Admin Panel */}
      <div className={`admin-panel ${isAdminOpen ? 'active' : ''}`}>
        <div className="admin-panel-header">
          <h3>{t.adminPanel}</h3>
          <button onClick={toggleAdminPanel} className="close-admin-panel" aria-label={t.close}>
            <X size={20} />
          </button>
        </div>
        <div className="admin-panel-content">
          <div className="admin-section">
            <h4>Site Settings</h4>
            <div className="form-group">
              <label>Language</label>
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="form-control"
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
            {/* Add more admin controls here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;