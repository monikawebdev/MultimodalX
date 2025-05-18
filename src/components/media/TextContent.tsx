
import React from 'react';
import { cn } from '../../lib/utils';


interface TextContentProps {
  content: string;
  className?: string;
}

const TextContent: React.FC<TextContentProps> = ({ content, className }) => {
  // Check if content has markdown-style formatting
  const hasFormatting = content.includes('**') || content.includes('*') || 
                         content.includes('##') || content.includes('```');
  
  // Simple rendering of markdown-like syntax
  const renderFormattedText = (text: string) => {
    // Process code blocks
    let processed = text.replace(/```([^`]+)```/g, '<div class="code-block">$1</div>');
    
    // Process bold text
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Process italic text
    processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Process headings
    processed = processed.replace(/## ([^\n]+)/g, '<h2 class="text-xl font-bold mt-2 mb-1">$1</h2>');
    
    // Process lists
    processed = processed.replace(/(\d+\. [^\n]+)/g, '<li>$1</li>');
    
    // Replace newlines with break tags
    processed = processed.replace(/\n/g, '<br />');
    
    return processed;
  };
  
  return (
    <div className={cn("text-content", className)}>
      {hasFormatting ? (
        <div dangerouslySetInnerHTML={{ __html: renderFormattedText(content) }} />
      ) : (
        <p className="whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};

export default TextContent;
