import React, { useState, useEffect } from 'react';
import requestDeduplicationService from '../services/requestDeduplicationService';

interface ApiDebugPanelProps {
  isVisible?: boolean;
}

const ApiDebugPanel: React.FC<ApiDebugPanelProps> = ({ isVisible = false }) => {
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const info = requestDeduplicationService.getDebugInfo();
      const count = requestDeduplicationService.getPendingRequestCount();
      setDebugInfo(info);
      setPendingCount(count);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mb-2 px-3 py-2 rounded-lg text-white font-medium transition-colors ${
          pendingCount > 0 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-gray-500 hover:bg-gray-600'
        }`}
      >
        API Debug ({pendingCount})
      </button>

      {/* Debug Panel */}
      {isExpanded && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">API Request Monitor</h3>
            <button
              onClick={() => {
                requestDeduplicationService.cancelAllRequests();
                setDebugInfo([]);
                setPendingCount(0);
              }}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Pending Requests: </span>
              <span className={pendingCount > 0 ? 'text-orange-600 font-bold' : 'text-green-600'}>
                {pendingCount}
              </span>
            </div>

            {debugInfo.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Active Requests:</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                      <div className="font-mono text-gray-600 truncate" title={info.key}>
                        {info.key}
                      </div>
                      <div className="text-gray-500 mt-1">
                        Age: {Math.round(info.age / 1000)}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No pending requests
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              This panel shows duplicate API call prevention in action.
              Multiple identical requests are automatically deduplicated.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugPanel;
