
import React from 'react';
import { Message as MessageType, MediaType } from '../../types/chat';
import { Avatar } from '../../components/ui/avatar';
import { cn } from '../../lib/utils';

// Media components
import TextContent from '../media/TextContent';
import CodeContent from '../media/CodeContent';
import ImageContent from '../media/ImageContent';
import AudioContent from '../media/AudioContent';
import VideoContent from '../media/VideoContent';
import DocumentContent from '../media/DocumentContent';
import SpreadsheetContent from '../media/SpreadsheetContent';
import { useChat } from '../../context/ChatContext';

interface MessageProps {
  message: MessageType;
}

const MediaRenderer: React.FC<{ 
  type: MediaType; 
  content: string; 
  metadata?: Record<string, any>;
  mediaId: string;
}> = ({ type, content, metadata, mediaId }) => {
  switch (type) {
    case 'text':
      return <TextContent content={content} />;
    case 'code':
      return <CodeContent content={content} language={metadata?.language} />;
    case 'image':
      return <ImageContent src={content} alt={metadata?.alt} mediaId={mediaId} />;
    case 'audio':
      return <AudioContent src={content} />;
    case 'video':
      return <VideoContent src={content} />;
    case 'document':
      return <DocumentContent content={content} filename={metadata?.filename} />;
    case 'spreadsheet':
      return <SpreadsheetContent content={content} metadata={metadata} />;
    default:
      return <div>Unsupported media type: {type}</div>;
  }
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const { chatState, selectMessage } = useChat();
  const { selectedMessageId } = chatState;
  
  const isSelected = selectedMessageId === message.id;
  const isUserMessage = message.sender === 'user';
  
  const handleClick = () => {
    selectMessage(isSelected ? null : message.id);
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // For typing indicator
  if (message.isTyping) {
    return (
      <div className={cn("flex items-start gap-2 mb-4", isUserMessage ? "justify-end" : "justify-start")}>
        {!isUserMessage && (
          <Avatar className="w-8 h-8 bg-primary text-white flex items-center justify-center">
            <span className="text-xs font-bold">AI</span>
          </Avatar>
        )}
        
        <div className={cn(
          "chat-bubble",
          isUserMessage ? "chat-bubble-user" : "chat-bubble-assistant"
        )}>
          <div className="flex gap-1">
            <span className="animate-pulse">•</span>
            <span className="animate-pulse delay-100">•</span>
            <span className="animate-pulse delay-200">•</span>
          </div>
        </div>
        
        {isUserMessage && (
          <Avatar className="w-8 h-8 bg-zinc-800 text-white flex items-center justify-center">
            <span className="text-xs font-bold">You</span>
          </Avatar>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex items-start gap-2 mb-4", 
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isUserMessage && (
        <Avatar className="w-8 h-8 bg-primary text-white flex items-center justify-center">
          <span className="text-xs font-bold">AI</span>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isSelected && "ring-2 ring-primary ring-offset-2 rounded-xl"
        )}
        onClick={handleClick}
      >
        {message.content.map((item, index) => (
          <div 
            key={item.id} 
            className={cn(
              "rounded-xl p-4",
              isUserMessage ? "bg-primary text-white" : "bg-secondary text-secondary-foreground",
              message.content.length > 1 && index === 0 && isUserMessage && "rounded-br-none",
              message.content.length > 1 && index === 0 && !isUserMessage && "rounded-bl-none",
              message.content.length > 1 && index === message.content.length - 1 && isUserMessage && "rounded-tr-none",
              message.content.length > 1 && index === message.content.length - 1 && !isUserMessage && "rounded-tl-none",
              message.content.length > 1 && index > 0 && index < message.content.length - 1 && isUserMessage && "rounded-r-none",
              message.content.length > 1 && index > 0 && index < message.content.length - 1 && !isUserMessage && "rounded-l-none",
              item.type !== 'text' && "overflow-hidden p-0"
            )}
          >
            <div className={cn(
              item.type !== 'text' && isUserMessage && "p-4 bg-primary/10",
              item.type !== 'text' && !isUserMessage && "p-4 bg-secondary/50",
              item.type === 'text' && "p-0"
            )}>
              <MediaRenderer 
                type={item.type} 
                content={item.content} 
                metadata={item.metadata}
                mediaId={item.id} 
              />
            </div>
          </div>
        ))}
        
        <div className={cn(
          "text-xs opacity-70 px-1",
          isUserMessage ? "text-right" : "text-left" 
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      
      {isUserMessage && (
        <Avatar className="w-8 h-8 bg-zinc-800 text-white flex items-center justify-center">
          <span className="text-xs font-bold">You</span>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
