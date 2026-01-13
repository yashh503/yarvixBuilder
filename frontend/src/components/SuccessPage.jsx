import { Button } from './ui/button';
import { Check, Copy, ExternalLink, Plus, Share2, Sparkles, PartyPopper } from 'lucide-react';
import { useState } from 'react';

export function SuccessPage({ publishData, onCreateNew }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publishData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my new website!',
          url: publishData.url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Confetti-like particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#F59E0B', '#10B981', '#EC4899', '#3B82F6', '#8B5CF6'][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-lg w-full text-center">
        {/* Success icon with animation */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <div className="absolute -top-2 -right-2">
            <PartyPopper className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your website is now live and ready for the world!
        </p>

        {/* URL Box */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 mb-6">
          <p className="text-sm font-medium text-gray-500 mb-3">Your site is live at</p>
          <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-200">
            <div className="flex-1 px-3 py-2 overflow-hidden">
              <code className="text-sm text-purple-600 font-medium truncate block">
                {publishData.url}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className={`p-3 rounded-lg transition-all ${
                copied
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2 font-medium">Copied to clipboard!</p>
          )}
        </div>

        {/* Custom Domain Instructions */}
        {publishData.customDomain && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Custom Domain Setup</p>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Point <strong className="font-semibold">{publishData.customDomain}</strong> to our servers:
            </p>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Type:</span>
                <code className="font-mono font-semibold">CNAME</code>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-500">Value:</span>
                <code className="font-mono font-semibold text-blue-600">sites.siteforge.app</code>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
          >
            <a href={publishData.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Your Site
            </a>
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 h-12"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={onCreateNew}
              className="flex-1 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Another
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6">
          Built with SiteForge • Changes may take up to 5 minutes to propagate
        </p>
      </div>
    </div>
  );
}
