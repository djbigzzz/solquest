import React, { useEffect } from 'react';

const SuccessModal = ({ title, message, onClose }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-gray-800 border border-purple-500/30 rounded-xl shadow-2xl w-full max-w-md mx-4 z-10 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-4 px-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {title}
          </h3>
        </div>
        
        {/* Content */}
        <div className="py-6 px-6">
          <div className="mb-6">
            <p className="text-gray-200 text-center">{message}</p>
          </div>
          
          {/* Confetti animation */}
          <div className="relative h-16 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"
                    style={{ 
                      animationDuration: `${0.8 + i * 0.2}s`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-16 w-16 text-yellow-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
