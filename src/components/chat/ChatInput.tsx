import React, { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { getSuggestionsByContext } from '../../utils/mockData';
import { MediaType, MediaContent } from '../../types/chat';
import { 
  SendHorizonal, Smile, Image, FileText, 
  FileAudio, FileVideo, X, MessageCircle,
  PenLine 
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ChatInput: React.FC = () => {
  const { chatState, sendMessage, toggleAnnotationMode } = useChat();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [text, setText] = useState('');
  const [mediaContents, setMediaContents] = useState<MediaContent[]>([]);
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('text');
  
  // Get context-aware suggestions
  const lastMessage = chatState.messages[chatState.messages.length - 1];
  const suggestions = getSuggestionsByContext(lastMessage);
  
  const handleMediaTypeChange = (type: MediaType) => {
    if (type === activeMediaType) {
      // Toggle annotation mode if clicking annotation button
      if (type === 'text' && suggestions.find(s => s.label === 'Annotate')) {
        toggleAnnotationMode();
        toast({
          title: chatState.isAnnotating ? "Annotation mode disabled" : "Annotation mode enabled",
          description: chatState.isAnnotating 
            ? "You can now add annotations to media by clicking on it"
            : "Click on a message first to select it for annotation",
        });
      }
      return;
    }
    
    setActiveMediaType(type);
    
    // Trigger file selection dialog for media types
    if (['image', 'audio', 'video', 'document'].includes(type)) {
      fileInputRef.current?.click();
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real app, we'd upload the file to a server and get a URL
    // For this demo, we'll use a placeholder URL based on the file type
    let placeholder = '';
    
    switch (activeMediaType) {
      case 'image':
        placeholder = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
        break;
      case 'audio':
        placeholder = 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
        break;
      case 'video':
        placeholder = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        break;
      case 'document':
        placeholder = 'This is a sample document content.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.';
        break;
    }
    
    addMediaContent({
      id: Math.random().toString(36).substring(2, 9),
      type: activeMediaType,
      content: placeholder,
      metadata: {
        filename: file.name,
        type: file.type,
        size: file.size
      }
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const addMediaContent = (content: MediaContent) => {
    setMediaContents(prev => [...prev, content]);
    
    // After adding non-text content, switch back to text mode
    if (content.type !== 'text') {
      setActiveMediaType('text');
    }
  };
  
  const handleSend = () => {
    if (text.trim() === '' && mediaContents.length === 0) return;
    
    const allContents: MediaContent[] = [
      ...mediaContents
    ];
    
    if (text.trim() !== '') {
      allContents.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'text',
        content: text.trim()
      });
    }
    
    sendMessage(allContents);
    
    // Reset state
    setText('');
    setMediaContents([]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const removeMediaContent = (id: string) => {
    setMediaContents(prev => prev.filter(content => content.id !== id));
  };
  
  const renderMediaPreview = (content: MediaContent) => {
    switch (content.type) {
      case 'image':
        return (
          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-neutral-100">
            <img 
              src={content.content} 
              alt={content.metadata?.alt || "Uploaded image"} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="relative flex items-center gap-2 bg-neutral-100 rounded-md p-2">
            <FileAudio className="h-5 w-5" />
            <span className="text-xs truncate max-w-[100px]">
              {content.metadata?.filename || "Audio file"}
            </span>
          </div>
        );
      case 'video':
        return (
          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-neutral-100 flex items-center justify-center">
            <FileVideo className="h-8 w-8 text-neutral-500" />
          </div>
        );
      case 'document':
        return (
          <div className="relative flex items-center gap-2 bg-neutral-100 rounded-md p-2">
            <FileText className="h-5 w-5" />
            <span className="text-xs truncate max-w-[100px]">
              {content.metadata?.filename || "Document file"}
            </span>
          </div>
        );
      case 'code':
        return (
          <div className="relative flex items-center gap-2 bg-neutral-100 rounded-md p-2">
            <FileText className="h-5 w-5" />
            <span className="text-xs truncate max-w-[100px]">
              {content.metadata?.language || "Code snippet"}
            </span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-lg p-2 bg-background">
      {/* Media previews */}
      {mediaContents.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-b mb-2">
          {mediaContents.map(content => (
            <div key={content.id} className="relative group">
              {renderMediaPreview(content)}
              <button 
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full h-4 w-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMediaContent(content.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Media type suggestions */}
      <div className="flex items-center gap-2 mb-2 px-2">
        {suggestions.map((suggestion) => {
          const isActive = activeMediaType === suggestion.type && 
                          (suggestion.label !== 'Annotate' || chatState.isAnnotating);
          
          const Icon = (() => {
            switch (suggestion.icon) {
              case 'message-circle': return MessageCircle;
              case 'image': return Image;
              case 'file-text': return FileText;
              case 'file-audio': return FileAudio;
              case 'file-video': return FileVideo;
              case 'annotation': return PenLine;
              default: return MessageCircle;
            }
          })();
          
          return (
            <Button
              key={suggestion.label}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleMediaTypeChange(suggestion.type)}
            >
              <Icon className="h-4 w-4" />
              <span>{suggestion.label}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Hidden file input for media uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept={
          activeMediaType === 'image' ? 'image/*' :
          activeMediaType === 'audio' ? 'audio/*' :
          activeMediaType === 'video' ? 'video/*' :
          activeMediaType === 'document' ? '.pdf,.doc,.docx,.txt' :
          undefined
        }
      />
      
      {/* Input area */}
      <div className="flex items-end gap-2">
        <Textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-10 max-h-40 rounded-lg flex-1"
          rows={1}
        />
        <Button size="icon" onClick={handleSend}>
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
