

import ChatInterface from '../../src/components/chat/ChatInterface';
import { ChatProvider } from '../../src/context/ChatContext';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </div>
  );
};

export default Index;
