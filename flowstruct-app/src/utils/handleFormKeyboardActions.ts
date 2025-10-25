import React from 'react';

export const handleFormKeyboardActions = (e: React.KeyboardEvent, onEscapeKeyPress: () => void) => {
  if (e && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const form = e.currentTarget?.querySelector('form');
    if (form) form.requestSubmit();
  }
  if (e.key === 'Escape') {
    onEscapeKeyPress();
  }
};
