import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, Globe, Link as LinkIcon, Loader2 } from 'lucide-react';
import { api, API_URL } from '../lib/utils';

export function PaymentModal({ open, onClose, siteId, siteData, onPublished }) {
  const [plan, setPlan] = useState('basic');
  const [customDomain, setCustomDomain] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹500',
      description: 'Publish on our subdomain',
      features: ['yoursite.webbuilder.com/slug', 'SSL included', 'Fast CDN'],
    },
    {
      id: 'custom',
      name: 'Custom Domain',
      price: '₹1000',
      description: 'Use your own domain',
      features: ['yourdomain.com', 'SSL included', 'DNS setup guide'],
    },
  ];

  const handlePayment = async () => {
    if (!email) {
      setError('Email is required to receive site access');
      return;
    }

    if (plan === 'custom' && !customDomain) {
      setError('Please enter your custom domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const order = await api('/site/create-order', {
        method: 'POST',
        body: JSON.stringify({ siteId, plan }),
      });

      // Load Razorpay
      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_key',
        amount: order.amount,
        currency: order.currency,
        name: 'WebBuilder',
        description: `Publish ${siteData.content.name}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // Verify payment and publish
            const result = await api('/site/publish', {
              method: 'POST',
              body: JSON.stringify({
                siteId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                customDomain: plan === 'custom' ? customDomain : null,
                email,
              }),
            });

            onPublished(result);
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email,
        },
        theme: {
          color: siteData.colors.primary,
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  // Demo mode - skip actual payment for testing
  const handleDemoPublish = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      // For demo, directly call a mock publish endpoint
      const slug = siteData.content.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 20) + '-' + Math.random().toString(36).slice(2, 8);

      onPublished({
        slug,
        url: `${window.location.origin}/s/${slug}`,
        customDomain: plan === 'custom' ? customDomain : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Publish Your Site</DialogTitle>
          <DialogDescription>
            Choose a plan to make your site live
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-3">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  plan === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">{p.price}</p>
                  </div>
                  {plan === p.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{p.description}</p>
                <ul className="space-y-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-center gap-1">
                      {i === 0 ? (
                        p.id === 'basic' ? <LinkIcon className="w-3 h-3" /> : <Globe className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Custom Domain Input */}
          {plan === 'custom' && (
            <div>
              <Label htmlFor="customDomain">Your Domain</Label>
              <Input
                id="customDomain"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll need to configure DNS after publishing
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <Label htmlFor="email">Your Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send your site link and login access here
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDemoPublish} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${plan === 'basic' ? '₹500' : '₹1000'}`
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-400">
            Demo mode: Payment simulation enabled
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
