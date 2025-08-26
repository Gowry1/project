import React from 'react';
import { ExternalLink, BookOpen, Brain, Mic, Info } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      title: "Understanding Parkinson's Voice Changes",
      description: "An overview of how Parkinson's disease affects vocal production and speech patterns.",
      link: "#",
      icon: <Mic className="h-5 w-5" />,
      category: "Voice Biomarkers"
    },
    {
      title: "The Science Behind Voice Analysis",
      description: "Learn about the acoustic features and AI algorithms used to detect Parkinson's indicators.",
      link: "#",
      icon: <Brain className="h-5 w-5" />,
      category: "Technology"
    },
    {
      title: "Early Detection Benefits",
      description: "How detecting Parkinson's disease early through voice analysis can improve treatment outcomes.",
      link: "#",
      icon: <Info className="h-5 w-5" />,
      category: "Medical"
    },
    {
      title: "Parkinson's Foundation",
      description: "Official resource for comprehensive information about Parkinson's disease.",
      link: "https://www.parkinson.org/",
      icon: <ExternalLink className="h-5 w-5" />,
      category: "External Resources"
    },
    {
      title: "Michael J. Fox Foundation",
      description: "Leading organization dedicated to finding a cure for Parkinson's disease.",
      link: "https://www.michaeljfox.org/",
      icon: <ExternalLink className="h-5 w-5" />,
      category: "External Resources"
    },
    {
      title: "Vocal Exercises for Parkinson's",
      description: "Therapeutic exercises that may help maintain vocal strength and clarity.",
      link: "#",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Self-Care"
    }
  ];

  // Group resources by category
  const groupedResources: { [key: string]: typeof resources } = {};
  resources.forEach(resource => {
    if (!groupedResources[resource.category]) {
      groupedResources[resource.category] = [];
    }
    groupedResources[resource.category].push(resource);
  });

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Educational Resources</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn more about Parkinson's disease, voice biomarkers, and how our technology works.
          Explore these resources to better understand the science behind NeuroVox.
        </p>
      </section>

      {/* Hero Resource */}
      <section className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl overflow-hidden shadow-md">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Voice as a Biomarker for Neurological Disorders
              </h2>
              <p className="text-gray-700 mb-6">
                Research shows that voice changes often precede other symptoms in Parkinson's disease by several years. 
                Subtle acoustic variations in speech can provide early indicators of neurological changes, potentially 
                allowing for earlier diagnosis and intervention.
              </p>
              <a 
                href="#"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Read the full article
              </a>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-white p-5 rounded-full shadow-lg">
                <Brain className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <section key={category} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  target={resource.link.startsWith('http') ? "_blank" : undefined}
                  rel={resource.link.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-full h-fit mr-4">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      {resource.title}
                      {resource.link.startsWith('http') && (
                        <ExternalLink className="inline-block h-3.5 w-3.5 ml-1 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ Section */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                How accurate is voice analysis for detecting Parkinson's?
              </h3>
              <p className="text-gray-600">
                Current research shows that AI-powered voice analysis can detect Parkinson's indicators with 
                80-90% accuracy. However, it should be used as a screening tool and not as a definitive diagnosis. 
                Always consult a healthcare professional for proper medical evaluation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                How often should I record my voice?
              </h3>
              <p className="text-gray-600">
                For monitoring purposes, recording once every 1-3 months is typically sufficient. If you notice 
                significant changes in your voice or speech, you may want to record more frequently and share the 
                results with your healthcare provider.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Is my data secure and private?
              </h3>
              <p className="text-gray-600">
                Yes, NeuroVox takes data privacy seriously. All voice recordings and analysis results are encrypted 
                and stored securely. You maintain ownership of your data, and it is never shared with third parties 
                without your explicit consent.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Can I use this as a replacement for medical care?
              </h3>
              <p className="text-gray-600">
                No, NeuroVox is designed as a screening and monitoring tool and should not replace professional 
                medical care. If you receive results indicating a high risk, please consult with a neurologist or 
                movement disorder specialist for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;