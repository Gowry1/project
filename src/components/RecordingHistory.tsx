import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recording } from '../types';
import { Calendar, Clock, AlertTriangle, CheckCircle, Mic, BarChart3, TrendingUp } from 'lucide-react';

interface RecordingHistoryProps {
  recordings: Recording[];
  onSelectRecording: (recording: Recording) => void;
}

const RecordingHistory: React.FC<RecordingHistoryProps> = ({ 
  recordings, 
  onSelectRecording 
}) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleSelectRecording = (recording: Recording) => {
    onSelectRecording(recording);
    navigate(`/results/${recording.id}`);
  };

  // Group recordings by date
  const groupedRecordings: { [key: string]: Recording[] } = {};
  recordings.forEach(recording => {
    const dateKey = formatDate(new Date(recording.timestamp));
    if (!groupedRecordings[dateKey]) {
      groupedRecordings[dateKey] = [];
    }
    groupedRecordings[dateKey].push(recording);
  });

  // Calculate summary statistics
  const totalRecordings = recordings.length;
  const highRiskCount = recordings.filter(r => r.result.percentage_normal > 80).length;
  const moderateRiskCount = recordings.filter(r => r.result.percentage_normal >= 50 && r.result.percentage_normal <= 80).length;
  const lowRiskCount = recordings.filter(r => r.result.percentage_normal < 50).length;
  const averageConfidence = recordings.length > 0
    ? recordings.reduce((sum, r) => sum + r.result.confidence, 0) / recordings.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      {totalRecordings > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{totalRecordings}</div>
                <div className="text-sm text-gray-500">Total Recordings</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
                <div className="text-sm text-gray-500">High Risk</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{moderateRiskCount}</div>
                <div className="text-sm text-gray-500">Moderate Risk</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{lowRiskCount}</div>
                <div className="text-sm text-gray-500">Low Risk</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-500">Average Confidence</div>
              <div className="text-lg font-semibold text-gray-900">{(averageConfidence * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Recording History */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recording History</h2>
        
        {Object.keys(groupedRecordings).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedRecordings).map(([dateKey, dateRecordings]) => (
              <div key={dateKey}>
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-700">{dateKey}</h3>
                </div>
                
                <div className="space-y-3">
                  {dateRecordings.map(recording => {
                    const percentageNormal = recording.result.percentage_normal;
                    const isHigh = percentageNormal > 80;
                    const isModerate = percentageNormal >= 50 && percentageNormal <= 80;
                    
                    return (
                      <div
                        key={recording.id}
                        onClick={() => handleSelectRecording(recording)}
                        className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {/* Header Section */}
                        <div className="flex items-center p-4">
                          <div className="mr-4">
                            {isHigh ? (
                              <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                              </div>
                            ) : isModerate ? (
                              <div className="p-2 bg-orange-100 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-orange-500" />
                              </div>
                            ) : (
                              <div className="p-2 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {recording.result.prediction || 'Analysis Result'}
                                </h4>
                                <div className="text-sm text-gray-500">
                                  {isHigh ? 'High Risk' : isModerate ? 'Moderate Risk' : 'Low Risk'} •
                                  Normal: {recording.result.percentage_normal}%
                                </div>
                              </div>

                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{formatTime(new Date(recording.timestamp))}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="px-4 pb-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {/* Recording Duration */}
                            <div className="flex items-center">
                              <Mic className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-gray-500">Duration</div>
                                <div className="font-medium">{recording.duration}s</div>
                              </div>
                            </div>

                            {/* Confidence Score */}
                            <div className="flex items-center">
                              <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-gray-500">Confidence</div>
                                <div className="font-medium">{(recording.result.confidence * 100).toFixed(1)}%</div>
                              </div>
                            </div>

                            {/* Total Predictions */}
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-gray-500">Total Count</div>
                                <div className="font-medium">{recording.result.normal_count || 'N/A'}</div>
                              </div>
                            </div>

                            {/* Probability */}
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                              <div>
                                <div className="text-gray-500">Probability</div>
                                <div className="font-medium">{(recording.result.probability * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>

                          {/* Voice Features */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-2">Voice Features</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <div className="text-gray-500">Jitter</div>
                                <div className="font-medium">{recording.result.features.jitter.toFixed(4)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Shimmer</div>
                                <div className="font-medium">{recording.result.features.shimmer.toFixed(4)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Harmonicity</div>
                                <div className="font-medium">{recording.result.features.harmonicity.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Pitch</div>
                                <div className="font-medium">{recording.result.features.pitch.toFixed(1)} Hz</div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Normal Percentage</span>
                              <span>{recording.result.percentage_normal}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  isHigh
                                    ? "bg-red-500"
                                    : isModerate
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${recording.result.percentage_normal}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No recordings found</div>
            <p className="text-gray-600">
              Start recording your voice to analyze for Parkinson's indicators
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RecordingHistory;