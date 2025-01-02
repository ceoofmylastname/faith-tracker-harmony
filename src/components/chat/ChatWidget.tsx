import { useEffect } from 'react';

// Extend the Window interface to include our widget
declare global {
  interface Window {
    myChatWidget?: {
      load: (config: { id: string }) => void;
    };
  }
}

export const ChatWidget = () => {
  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://agentivehub.com/production.bundle.min.js';
    script.crossOrigin = 'anonymous'; // Add CORS header
    
    script.onload = () => {
      // Create a specific container for the chat widget instead of using 'root'
      if (!document.getElementById('chat-widget-container')) {
        const container = document.createElement('div');
        container.id = 'chat-widget-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }
      
      // Add a small delay to ensure the widget script is fully loaded
      setTimeout(() => {
        if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
          try {
            window.myChatWidget.load({
              id: 'c99ecb8f-1068-4e6d-b1a1-d5dc4432198d',
            });
          } catch (error) {
            console.error('Error loading chat widget:', error);
          }
        }
      }, 100);
    };

    script.onerror = (error) => {
      console.error('Error loading chat widget script:', error);
    };

    // Add the script to the document
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      script.remove();
      // Remove the container if it was created by our widget
      const container = document.getElementById('chat-widget-container');
      if (container) {
        container.remove();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything directly
};