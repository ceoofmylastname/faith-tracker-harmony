import { useEffect } from 'react';

declare global {
  interface Window {
    myChatWidget?: {
      load: (config: { id: string }) => void;
    };
  }
}

export function ChatWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: 'c99ecb8f-1068-4e6d-b1a1-d5dc4432198d',
        });
      }
    };
    script.src = "https://agentivehub.com/production.bundle.min.js";
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}