
import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import Message from '../chat/Message';
import ChatInput from './ChatInput';
import { Button } from '../../components/ui/button';
import { PenLine } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { chatState, toggleAnnotationMode } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Adaptive Chat</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant={chatState.isAnnotating ? "default" : "outline"}
            size="sm"
            onClick={toggleAnnotationMode}
          >
            <PenLine className="h-4 w-4 mr-2" />
            {chatState.isAnnotating ? 'Annotating' : 'Annotate'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {chatState.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
