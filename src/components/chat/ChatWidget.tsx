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
    
    script.onload = () => {
      if (!document.getElementById('root')) {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
      }
      
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: 'c99ecb8f-1068-4e6d-b1a1-d5dc4432198d',
        });
      }
    };

    // Add the script to the document
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      script.remove();
      // Remove the root div if it was created by our widget
      const root = document.getElementById('root');
      if (root) {
        root.remove();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything directly
};