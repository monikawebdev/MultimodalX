
import { Message, MediaType } from '../types/chat';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a mock message
export const createMockMessage = (
  sender: 'user' | 'assistant',
  content: { type: MediaType; content: string; metadata?: Record<string, any> }[]
): Message => {
  return {
    id: generateId(),
    sender,
    timestamp: Date.now(),
    content: content.map(item => ({
      id: generateId(),
      ...item
    })),
  };
};

// Initial mock messages
export const initialMessages: Message[] = [
  createMockMessage('assistant', [
    {
      type: 'text',
      content: "Hello! I'm your adaptive chat assistant. I can help you with various types of media and interactions. What would you like to do today?"
    }
  ]),
  createMockMessage('user', [
    {
      type: 'text',
      content: 'Can you help me with some code to create a React component?'
    }
  ]),
  createMockMessage('assistant', [
    {
      type: 'text',
      content: "Sure! Here's a simple React component example:"
    },
    {
      type: 'code',
      content: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`,
      metadata: {
        language: 'javascript'
      }
    }
  ]),
  createMockMessage('user', [
    {
      type: 'text',
      content: 'Can you explain how this image processing algorithm works?'
    },
    {
      type: 'image',
      content: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      metadata: {
        alt: 'Computer code on a screen',
        width: 600,
        height: 400
      }
    }
  ]),
  createMockMessage('assistant', [
    {
      type: 'text',
      content: 'This appears to be an image of computer code displayed on a screen. Based on what I can see, this could represent an image processing algorithm that might be using techniques like:'
    },
    {
      type: 'text',
      content: '1. **Convolution operations** - applying filters to extract features\n2. **Color space transformations** - converting between RGB, HSV, etc.\n3. **Edge detection** - identifying boundaries in images\n4. **Image segmentation** - dividing images into meaningful segments'
    }
  ]),
  createMockMessage('user', [
    {
      type: 'text',
      content: 'Can you create a simple data visualization for me?'
    }
  ]),
  createMockMessage('assistant', [
    {
      type: 'text',
      content: 'Here\'s a simple bar chart visualization:'
    },
    {
      type: 'spreadsheet',
      content: JSON.stringify({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Sales 2023',
            data: [65, 59, 80, 81, 56],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }
        ]
      }),
      metadata: {
        type: 'bar-chart',
        title: 'Monthly Sales Data'
      }
    }
  ])
];

// Suggestions based on context
export const getSuggestionsByContext = (lastMessage?: Message): { icon: string; type: MediaType; label: string }[] => {
  const defaultSuggestions = [
    { icon: 'message-circle', type: 'text' as MediaType, label: 'Text' },
    { icon: 'image', type: 'image' as MediaType, label: 'Image' },
    { icon: 'file-text', type: 'code' as MediaType, label: 'Code' },
    { icon: 'file-audio', type: 'audio' as MediaType, label: 'Audio' },
    { icon: 'file-video', type: 'video' as MediaType, label: 'Video' },
  ];

  if (!lastMessage) return defaultSuggestions;

  // If the last message was about code
  if (lastMessage.content.some(c => c.type === 'code')) {
    return [
      { icon: 'message-circle', type: 'text' as MediaType, label: 'Text' },
      { icon: 'file-text', type: 'code' as MediaType, label: 'Code' },
      { icon: 'image', type: 'image' as MediaType, label: 'Screenshot' },
    ];
  }

  // If the last message was about an image
  if (lastMessage.content.some(c => c.type === 'image')) {
    return [
      { icon: 'message-circle', type: 'text' as MediaType, label: 'Text' },
      { icon: 'image', type: 'image' as MediaType, label: 'Image' },
      { icon: 'pen-line', type: 'text' as MediaType, label: 'Annotate' },
    ];
  }

  return defaultSuggestions;
};

// Mock responses for different types of messages
export const getMockResponse = (userMessage: Message): Message => {
  const hasImage = userMessage.content.some(c => c.type === 'image');
  const hasCode = userMessage.content.some(c => c.type === 'code');
  const hasAudio = userMessage.content.some(c => c.type === 'audio');
  const hasVideo = userMessage.content.some(c => c.type === 'video');
  
  let responseContent: { type: MediaType; content: string; metadata?: Record<string, any> }[] = [];

  // Default response if nothing else matches
  responseContent = [{ 
    type: 'text', 
    content: 'I received your message! How can I help you further?' 
  }];

  // Check for message content and generate appropriate responses
  const textContent = userMessage.content.find(c => c.type === 'text')?.content.toLowerCase() || '';

  if (textContent.includes('hello') || textContent.includes('hi')) {
    responseContent = [{ 
      type: 'text', 
      content: 'Hello there! How can I assist you today?' 
    }];
  } else if (textContent.includes('code') || hasCode) {
    responseContent = [
      { 
        type: 'text', 
        content: 'Here\'s a code snippet that might help:' 
      },
      {
        type: 'code',
        content: `function processData(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}`,
        metadata: { language: 'javascript' }
      }
    ];
  } else if (textContent.includes('chart') || textContent.includes('visualization') || textContent.includes('data')) {
    responseContent = [
      { 
        type: 'text', 
        content: 'Here\'s a visualization of the data you requested:' 
      },
      {
        type: 'spreadsheet',
        content: JSON.stringify({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
            },
            {
              label: 'Dataset 2',
              data: [28, 48, 40, 19, 86, 27],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
            }
          ]
        }),
        metadata: { type: 'line-chart', title: 'Multi-series Data Visualization' }
      }
    ];
  } else if (textContent.includes('image') || hasImage) {
    responseContent = [
      { 
        type: 'text', 
        content: 'I analyzed the image you sent. Here are my observations:' 
      },
      {
        type: 'text',
        content: '1. The main subject appears to be in focus\n2. The lighting conditions seem optimal\n3. There are interesting patterns in the composition'
      }
    ];
  } else if (hasAudio) {
    responseContent = [
      { 
        type: 'text', 
        content: 'I listened to the audio clip. Here\'s my transcription and analysis:' 
      },
      {
        type: 'text',
        content: '"[Transcribed content would appear here]"\n\nThe audio quality is good with minimal background noise. The main points discussed were about project planning and resource allocation.'
      }
    ];
  } else if (hasVideo) {
    responseContent = [
      { 
        type: 'text', 
        content: 'I watched the video clip. Here\'s a summary:' 
      },
      {
        type: 'text',
        content: 'The video demonstrates a step-by-step process for setting up a development environment. Key timestamps:\n\n- 0:14 - Installation begins\n- 1:23 - Configuration settings\n- 2:45 - Test run of the environment'
      }
    ];
  }

  return createMockMessage('assistant', responseContent);
};
