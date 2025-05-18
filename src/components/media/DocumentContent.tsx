
import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

interface DocumentContentProps {
  content: string;
  filename?: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ content, filename = 'document.txt' }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-neutral-200 dark:bg-neutral-700 p-1 rounded">
            📄
          </div>
          <span className="font-medium">{filename}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md max-h-96 overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap">{content}</pre>
        </div>
      )}
    </Card>
  );
};

export default DocumentContent;
