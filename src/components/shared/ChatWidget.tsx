import { useEffect } from 'react';

export const ChatWidget = () => {
  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://agentivehub.com/production.bundle.min.js';
    
    script.onload = () => {
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: 'c99ecb8f-1068-4e6d-b1a1-d5dc4432198d',
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      // Clean up any widget elements that might have been created
      const widgetRoot = document.getElementById('root');
      if (widgetRoot && widgetRoot.parentNode === document.body) {
        document.body.removeChild(widgetRoot);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Return an empty div that will serve as the widget's container
  return <div id="chat-widget-container" />;
};