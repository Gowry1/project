import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  backgroundVariant?: 'blue' | 'purple';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  backgroundVariant = 'blue',
}) => {
  const backgroundClasses = {
    blue: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    purple: "bg-gradient-to-br from-purple-50 via-white to-blue-50",
  };

  const decorativeElements = {
    blue: (
      <>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </>
    ),
    purple: (
      <>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </>
    ),
  };

  const logoGradient = {
    blue: "from-blue-600 to-purple-600",
    purple: "from-purple-600 to-blue-600",
  };

  const logoRotation = {
    blue: "rotate-3 hover:rotate-0",
    purple: "-rotate-3 hover:rotate-0",
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[backgroundVariant]} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {decorativeElements[backgroundVariant]}
      </div>

      <div className="relative z-10 max-w-md w-full animate-fade-in-up">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative animate-float">
              <div className={`w-16 h-16 bg-gradient-to-r ${logoGradient[backgroundVariant]} rounded-2xl flex items-center justify-center shadow-lg transform ${logoRotation[backgroundVariant]} transition-transform duration-300 hover-glow`}>
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse-soft">
                <Sparkles className="h-2 w-2 text-yellow-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 glass hover-lift">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {footerText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
