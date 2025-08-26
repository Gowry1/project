import { Recording } from '../types';

export const generateMockRecordings = (): Recording[] => {
  const mockRecordings: Recording[] = [];

  // Generate 5 mock recordings
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2); // Every 2 days in the past
    
    const parkinsonian = Math.random() > 0.5;
    
    mockRecordings.push({
      id: `rec-${i + 1}`,
      timestamp: date,
      duration: Math.floor(Math.random() * 30) + 10, // 10-40 seconds
      audioUrl: '',
      result: {
        probability: parkinsonian ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3,
        confidence: 0.7 + Math.random() * 0.3,
        features: {
          jitter: parkinsonian ? 0.1 + Math.random() * 0.1 : Math.random() * 0.05,
          shimmer: parkinsonian ? 0.2 + Math.random() * 0.1 : Math.random() * 0.1,
          harmonicity: parkinsonian ? Math.random() * 0.5 : 0.5 + Math.random() * 0.5,
          pitch: parkinsonian ? 80 + Math.random() * 30 : 120 + Math.random() * 50
        }
      }
    });
  }

  return mockRecordings;
};