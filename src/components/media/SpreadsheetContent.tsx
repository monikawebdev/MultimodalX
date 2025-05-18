
import React, { useRef } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Download } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface SpreadsheetContentProps {
  content: string;
  metadata?: {
    type?: 'table' | 'bar-chart' | 'line-chart';
    title?: string;
  };
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ 
  content, 
  metadata = { type: 'bar-chart' } 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse the JSON content
  let parsedData;
  try {
    parsedData = JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse spreadsheet data', error);
    return <Card className="p-4">Invalid spreadsheet data format</Card>;
  }
  
  // Prepare data for charts
  const chartData = parsedData.labels.map((label: string, index: number) => {
    const dataPoint: any = { name: label };
    parsedData.datasets.forEach((dataset: any,) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });
  
  const handleDownload = () => {
    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      parsedData.labels.join(',') + '\n' + 
      parsedData.datasets.map((ds: any) => ds.data.join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${metadata.title || 'data'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Render different visualizations based on type
  const renderVisualization = () => {
    switch (metadata.type) {
      case 'line-chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {parsedData.datasets.map((dataset: any, index: number) => (
                <Line 
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor || `hsl(${index * 30}, 70%, 50%)`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar-chart':
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {parsedData.datasets.map((dataset: any, index: number) => (
                <Bar 
                  key={index}
                  dataKey={dataset.label}
                  fill={dataset.borderColor || `hsl(${index * 30}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  return (
    <Card className="p-4 w-full" ref={containerRef}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{metadata.title || 'Data Visualization'}</h3>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span>Download CSV</span>
        </Button>
      </div>
      
      <div className="mt-4">
        {renderVisualization()}
      </div>
    </Card>
  );
};

export default SpreadsheetContent;
