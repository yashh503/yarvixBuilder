import { useState } from 'react';
import { SitePreview } from './SitePreview';
import { PaymentModal } from './PaymentModal';
import { Button } from './ui/button';
import { ArrowLeft, Eye, Rocket, Smartphone, Monitor, Sparkles, Edit3 } from 'lucide-react';

export function PreviewPage({ siteData, siteId, onBack, onPublished }) {
  const [showPayment, setShowPayment] = useState(false);
  const [viewMode, setViewMode] = useState('mobile');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Edit</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Preview Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>

            <Button
              onClick={() => setShowPayment(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Publish Site
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="py-8 px-4 flex justify-center">
        <div className="relative">
          {/* Device frame for mobile view */}
          {viewMode === 'mobile' && (
            <div className="absolute -inset-3 bg-gray-900 rounded-[3rem] shadow-2xl" />
          )}

          <div
            className={`relative bg-white overflow-hidden transition-all duration-500 ease-out ${
              viewMode === 'mobile'
                ? 'w-[375px] rounded-[2.5rem] ring-8 ring-gray-900'
                : 'w-full max-w-5xl rounded-2xl shadow-2xl'
            }`}
            style={{
              maxHeight: viewMode === 'mobile' ? 'calc(100vh - 160px)' : 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >
            {/* Mobile notch */}
            {viewMode === 'mobile' && (
              <div className="sticky top-0 z-10 flex justify-center py-2 bg-white">
                <div className="w-32 h-6 bg-gray-900 rounded-full" />
              </div>
            )}

            <SitePreview siteData={siteData} />
          </div>
        </div>
      </div>

      {/* Floating action hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full shadow-lg text-sm">
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <span>Looking good! Ready to publish?</span>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        siteId={siteId}
        siteData={siteData}
        onPublished={onPublished}
      />
    </div>
  );
}
