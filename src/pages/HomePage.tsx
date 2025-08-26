import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, Clock, BookOpen, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-teal-500 rounded-2xl text-white overflow-hidden shadow-lg">
        <div className="p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Detect Parkinson's Through Voice Analysis
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              NeuroVox uses advanced AI to analyze vocal biomarkers, providing early detection of Parkinson's disease indicators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/record"
                className="flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Voice Analysis
              </Link>
              <Link
                to="/resources"
                className="flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="h-20 bg-white/10"></div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How NeuroVox Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Record Your Voice</h3>
            <p className="text-gray-600">
              Record a short voice sample reading a standardized passage. The process takes less than a minute.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
            <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
            <p className="text-gray-600">
              Our advanced AI model analyzes vocal biomarkers like jitter, shimmer, and harmonicity to detect Parkinson's indicators.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
            <div className="bg-teal-100 p-3 rounded-full w-fit mb-4">
              <Clock className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
            <p className="text-gray-600">
              Get immediate insights with detailed analysis and risk assessment, helping with early detection and monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">New Recording</h3>
              <p className="text-gray-600 mb-4">
                Start a new voice recording session to analyze for Parkinson's indicators.
              </p>
              <Link
                to="/record"
                className="inline-flex items-center text-primary hover:underline"
              >
                Start recording
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Mic className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">View History</h3>
              <p className="text-gray-600 mb-4">
                Access your previous recordings and analysis results to track changes over time.
              </p>
              <Link
                to="/history"
                className="inline-flex items-center text-purple-600 hover:underline"
              >
                View history
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-start gap-6 flex-col md:flex-row">
          <div className="bg-gray-100 p-4 rounded-lg md:w-1/3">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">About Parkinson's Voice Biomarkers</h3>
            <p className="text-gray-600">
              Voice changes can be one of the earliest indicators of Parkinson's disease, often occurring before motor symptoms.
            </p>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Voice Features We Analyze:</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Jitter</h4>
                  <p className="text-gray-600">Frequency variation from cycle to cycle in vocal fold vibration</p>
                </div>
              </li>
              <li className="flex">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Shimmer</h4>
                  <p className="text-gray-600">Amplitude variation in the sound wave, affected by vocal fold function</p>
                </div>
              </li>
              <li className="flex">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Harmonicity</h4>
                  <p className="text-gray-600">Ratio of harmonic to noise components in the voice, measuring voice clarity</p>
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                to="/resources"
                className="inline-flex items-center text-primary hover:underline"
              >
                Learn more about voice biomarkers
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;