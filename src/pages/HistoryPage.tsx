import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import RecordingHistory from '../components/RecordingHistory';
import historyService, { UserHistoryResponse } from '../services/historyService';
import { Recording } from '../types';

const HistoryPage: React.FC = () => {
  const { user, setCurrentRecording } = useAppContext();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setError('Please log in to view your recording history');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const historyData: UserHistoryResponse = await historyService.getCurrentUserHistory();
        const convertedRecordings = historyData.results.map(result =>
          historyService.convertToRecording(result)
        );

        setRecordings(convertedRecordings);
      } catch (error: any) {
        console.error('Failed to fetch recording history:', error);
        setError(error.message || 'Failed to load recording history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Recording History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and compare your previous voice recordings and analysis results.
            Track changes in your voice patterns over time.
          </p>
        </section>

        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your recording history...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Recording History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and compare your previous voice recordings and analysis results.
            Track changes in your voice patterns over time.
          </p>
        </section>

        <section className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load History</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Recording History</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View and compare your previous voice recordings and analysis results.
          Track changes in your voice patterns over time.
        </p>
      </section>

      <section className="max-w-3xl mx-auto">
        <RecordingHistory
          recordings={recordings}
          onSelectRecording={setCurrentRecording}
        />
      </section>
    </div>
  );
};

export default HistoryPage;