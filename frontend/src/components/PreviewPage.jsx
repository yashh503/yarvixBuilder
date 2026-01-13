import { useState } from 'react';
import { SitePreview } from './SitePreview';
import { PaymentModal } from './PaymentModal';
import { Button } from './ui/button';
import { ArrowLeft, Eye, Rocket, Smartphone, Monitor } from 'lucide-react';

export function PreviewPage({ siteData, siteId, onBack, onPublished }) {
  const [showPayment, setShowPayment] = useState(false);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1 text-sm">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <Button onClick={() => setShowPayment(true)} size="lg">
              <Rocket className="w-4 h-4 mr-2" />
              Publish Site
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="py-8 px-4 flex justify-center">
        <div
          className={`bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
        >
          <SitePreview siteData={siteData} />
        </div>
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
