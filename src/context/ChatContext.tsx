
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatState, Message, MediaType, MediaContent, Annotation } from '../types/chat';
import { initialMessages, getMockResponse } from '../utils/mockData';
import { useToast } from '../hooks/use-toast';

interface ChatContextType {
  chatState: ChatState;
  sendMessage: (content: MediaContent[]) => void;
  selectMessage: (id: string | null) => void;
  toggleAnnotationMode: () => void;
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: initialMessages,
    annotations: {},
    selectedMessageId: null,
    isAnnotating: false,
  });
  
  const { toast } = useToast();

  const sendMessage = (content: MediaContent[]) => {
    // Create user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      timestamp: Date.now(),
      content,
    };

    // Add user message to state
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Create a typing indicator for assistant
    const typingIndicator: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'assistant',
      timestamp: Date.now(),
      content: [{ id: 'typing', type: 'text', content: '' }],
      isTyping: true,
    };

    // Show typing indicator
    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, typingIndicator],
      }));

      // Generate mock response after delay
      setTimeout(() => {
        const assistantResponse = getMockResponse(userMessage);

        // Replace typing indicator with response
        setChatState(prev => ({
          ...prev,
          messages: prev.messages
            .filter(m => !m.isTyping)
            .concat(assistantResponse),
        }));
      }, 1500);
    }, 500);
  };

  const selectMessage = (id: string | null) => {
    setChatState(prev => ({
      ...prev,
      selectedMessageId: id,
      isAnnotating: id !== null && prev.isAnnotating,
    }));
  };

  const toggleAnnotationMode = () => {
    setChatState(prev => {
      const newIsAnnotating = !prev.isAnnotating;
      
      if (newIsAnnotating && !prev.selectedMessageId) {
        toast({
          title: "Please select a message first",
          description: "Select a message before entering annotation mode",
        });
        return prev;
      }
      
      return {
        ...prev,
        isAnnotating: newIsAnnotating,
      };
    });
  };

  const addAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation = {
      ...annotation,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setChatState(prev => {
      const mediaId = annotation.mediaId;
      const currentAnnotations = prev.annotations[mediaId] || [];
      
      return {
        ...prev,
        annotations: {
          ...prev.annotations,
          [mediaId]: [...currentAnnotations, newAnnotation],
        },
      };
    });

    toast({
      title: "Annotation added",
      description: "Your annotation has been saved",
    });
  };

  const removeAnnotation = (id: string) => {
    setChatState(prev => {
      const newAnnotations = { ...prev.annotations };
      
      // Find which media the annotation belongs to
      for (const mediaId in newAnnotations) {
        newAnnotations[mediaId] = newAnnotations[mediaId].filter(a => a.id !== id);
      }
      
      return {
        ...prev,
        annotations: newAnnotations,
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        sendMessage,
        selectMessage,
        toggleAnnotationMode,
        addAnnotation,
        removeAnnotation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
