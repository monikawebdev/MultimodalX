
import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useChat } from '../../context/ChatContext';

interface ImageContentProps {
  src: string;
  alt?: string;
  mediaId: string;
}

const ImageContent: React.FC<ImageContentProps> = ({ src, alt = 'Image', mediaId }) => {
  const { chatState, addAnnotation } = useChat();
  const [isZoomed, setIsZoomed] = useState(false);
  
  const annotations = chatState.annotations[mediaId] || [];
  
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (chatState.isAnnotating) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const annotationText = prompt('Enter annotation text:');
      if (annotationText) {
        addAnnotation({
          text: annotationText,
          position: { x, y },
          mediaId,
        });
      }
    } else {
      setIsZoomed(!isZoomed);
    }
  };
  
  return (
    <div className="relative">
      <Card className={`media-container ${isZoomed ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/80' : 'relative'}`}>
        <img 
          src={src} 
          alt={alt}
          className={`max-w-full ${isZoomed ? 'max-h-screen object-contain' : 'max-h-96'} cursor-pointer`}
          onClick={handleImageClick}
        />
        
        {isZoomed && (
          <Button 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
            onClick={() => setIsZoomed(false)}
          >
            Close
          </Button>
        )}
      </Card>
      
      {annotations.map((annotation) => (
        <div 
          key={annotation.id}
          className="absolute w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs transform -translate-x-1/2 -translate-y-1/2 cursor-help"
          style={{ 
            left: `${annotation.position.x}%`, 
            top: `${annotation.position.y}%` 
          }}
          title={annotation.text}
        >
          {annotations.indexOf(annotation) + 1}
        </div>
      ))}
    </div>
  );
};

export default ImageContent;
