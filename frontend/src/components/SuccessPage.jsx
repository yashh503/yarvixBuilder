import { Button } from './ui/button';
import { Check, Copy, ExternalLink, Plus } from 'lucide-react';
import { useState } from 'react';

export function SuccessPage({ publishData, onCreateNew }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publishData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your Site is Live!
        </h1>
        <p className="text-gray-600 mb-6">
          Congratulations! Your website is now published and ready to share.
        </p>

        {/* URL Box */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Your site URL</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border truncate">
              {publishData.url}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {publishData.customDomain && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Custom Domain Setup
            </p>
            <p className="text-sm text-blue-700 mb-2">
              Point your domain <strong>{publishData.customDomain}</strong> to:
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded border block">
              CNAME: sites.webbuilder.com
            </code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <a href={publishData.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Your Site
            </a>
          </Button>
          <Button variant="outline" onClick={onCreateNew} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Another Site
          </Button>
        </div>
      </div>
    </div>
  );
}
