
import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

interface CodeContentProps {
  content: string;
  language?: string;
}

const CodeContent: React.FC<CodeContentProps> = ({ content, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Code copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 w-full">
      <div className="flex items-center justify-between py-1 px-4 bg-neutral-200 dark:bg-neutral-700">
        <span className="text-xs font-mono">{language}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm">{content}</code>
      </pre>
    </Card>
  );
};

export default CodeContent;
