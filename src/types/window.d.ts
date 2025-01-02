interface Window {
  myChatWidget?: {
    load: (config: { id: string }) => void;
  };
}