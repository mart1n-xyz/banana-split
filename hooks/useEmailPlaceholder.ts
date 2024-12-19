import { useEffect } from 'react';

export const useEmailPlaceholder = () => {
  useEffect(() => {
    const updatePlaceholder = () => {
      const emailInput = document.querySelector('#email-input.login-method-button');
      if (emailInput) {
        emailInput.setAttribute('placeholder', 'your@status.im');
        // Also try to modify the value if it's empty
        if (!(emailInput as HTMLInputElement).value) {
          (emailInput as HTMLInputElement).placeholder = 'your@status.im';
        }
      }
    };

    // Run immediately
    updatePlaceholder();

    // Run on a short interval for the first few seconds
    const immediateInterval = setInterval(updatePlaceholder, 100);
    setTimeout(() => clearInterval(immediateInterval), 5000);

    // Keep running on a longer interval
    const longInterval = setInterval(updatePlaceholder, 1000);

    // Also watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        updatePlaceholder();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Cleanup
    return () => {
      clearInterval(immediateInterval);
      clearInterval(longInterval);
      observer.disconnect();
    };
  }, []);
}; 