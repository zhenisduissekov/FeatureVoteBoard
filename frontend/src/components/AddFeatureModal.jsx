import React, { useState, useEffect, useRef } from 'react';
import { X } from 'react-feather';
import './AddFeatureModal.css';

function AddFeatureModal({ isOpen, onClose, onAddFeature, t = {} }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  // Predefined categories
  const categories = [
    'All',
    'UI/UX',
    'Functionality',
    'Performance',
    'Security',
    'Other'
  ];

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setError('');
      // Focus the title input when modal opens
      setTimeout(() => {
        const titleInput = document.getElementById('title');
        if (titleInput) titleInput.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your feature');
      return;
    }

    // If new category is selected but no category name is provided
    if (isNewCategory && !category.trim()) {
      setError('Please enter a category name or select an existing one');
      return;
    }

    // If no category is selected and not creating a new one
    if (!isNewCategory && !category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddFeature({ 
        title, 
        description, 
        category: isNewCategory ? category.trim() : category 
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add feature. Please try again.');
      console.error('Error adding feature:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'new') {
      setIsNewCategory(true);
      setCategory('');
    } else {
      setIsNewCategory(false);
      setCategory(selectedCategory);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>{t.suggestNewFeature || 'Suggest a New Feature'}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label={t.close || 'Close'}
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">{t.featureTitle || 'Feature Title'} *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.whatWouldYouLikeToSee || 'What would you like to see?'}
              disabled={isSubmitting}
              maxLength={100}
              aria-required="true"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">{t.category || 'Category'}</label>
            {!isNewCategory ? (
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setIsNewCategory(true);
                    setCategory('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="form-control"
                disabled={isSubmitting}
              >
                <option value="">{t.selectCategory || 'Select a category'}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="new">+ {t.createNewCategory || 'Create new category'}</option>
              </select>
            ) : (
              <div className="new-category-input">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t.enterNewCategoryName || 'Enter new category name'}
                  aria-label={t.enterNewCategoryName || 'Enter new category name'}
                  className="form-control"
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  type="button"
                  className="cancel-category"
                  onClick={() => {
                    setIsNewCategory(false);
                    setCategory('');
                  }}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">{t.description || 'Description'}</label>
            <div className="description-container">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.tellUsMore || 'Tell us more about your suggestion (optional)'}
                rows={4}
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="character-count">{description.length}/500</div>
            </div>
            <p className="helper-text">
              {t.beClearAndConcise || 'Be clear and concise. What problem does this solve?'}
            </p>
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                border: '1px solid #d1d5db',
                marginRight: '0.75rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              {t.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !title.trim()}
              style={{
                padding: '0.5rem 1.25rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {t.submitting}
                </>
              ) : (
                t.submit || 'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeatureModal;