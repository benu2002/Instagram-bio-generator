/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BioForm } from './components/BioForm';
import { BioResult } from './components/BioResult';
import { ThemeToggle } from './components/ThemeToggle';
import { BioFormData, generateBios } from './services/gemini';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';

const INITIAL_DATA: BioFormData = {
  name: '',
  profession: '',
  audience: '',
  valueProp: '',
  keywords: '',
  ctaType: 'Follow for tips',
  website: '',
};

export default function App() {
  const [formData, setFormData] = useState<BioFormData>(INITIAL_DATA);
  const [bios, setBios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await generateBios(formData);
      setBios(results);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to generate bios. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(INITIAL_DATA);
    setBios([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              created by benubuild
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1 rounded-md text-white">
                <Instagram size={16} />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-none">
                InstaBio<span className="text-indigo-600 dark:text-indigo-400">Gen</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-24">
            <BioForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate} 
              onClear={handleClear}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-7/12">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {bios.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Generated Results
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {bios.length} options
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {bios.map((bio, index) => (
                    <div key={index}>
                      <BioResult bio={bio} index={index} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-2"
                  >
                    <Instagram size={18} />
                    Regenerate More Options
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                  <Instagram className="text-gray-300 dark:text-gray-600" size={48} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to create your perfect bio?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Fill out the form on the left to generate optimized Instagram bios tailored to your brand and audience.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Instagram Bio Generator. Created by benubuild.
          </p>
        </div>
      </footer>
    </div>
  );
}

