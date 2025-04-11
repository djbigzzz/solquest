import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: '#1E1E2E',
          color: '#fff',
          border: '1px solid #2D2D3A',
        },
        // Custom styling for different toast types
        success: {
          duration: 3000,
          style: {
            background: '#1E1E2E',
            color: '#fff',
            border: '1px solid #14F195',
          },
          iconTheme: {
            primary: '#14F195',
            secondary: '#1E1E2E',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#1E1E2E',
            color: '#fff',
            border: '1px solid #FF3B9A',
          },
          iconTheme: {
            primary: '#FF3B9A',
            secondary: '#1E1E2E',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
