import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Check,
  Globe,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { api } from "../lib/utils";

export function PaymentModal({ open, onClose, siteId, siteData, onPublished }) {
  const [plan, setPlan] = useState("basic");
  const [customDomain, setCustomDomain] = useState("");
  const [givenSlug, setGivenSlug] = useState("");
  const [givenValidSlug, setGivenValidSlug] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plans = [
    {
      id: "basic",
      name: "Starter",
      price: "₹0",
      priceNote: "one-time",
      description: "Perfect for getting started",
      features: [
        { text: "yarvix.space/your-slug", icon: LinkIcon },
        // { text: 'Fast global CDN', icon: Zap },
      ],
      popular: false,
      disabled: false,
    },
    {
      id: "custom",
      name: "Pro (Coming Soon)",
      price: "₹1000",
      priceNote: "one-time",
      description: "For professionals & brands",
      features: [
        { text: "Your own domain", icon: Globe },
        { text: "Free SSL certificate", icon: Shield },
        { text: "Priority support", icon: Sparkles },
      ],
      popular: false,
      disabled: true,
    },
  ];

  const checkSlugAvailability = async () => {
    if (!givenSlug) {
      setError("Slug is required.");
      return;
    }
    try {
      const check = await api("/site/checkavailability", {
        method: "POST",
        body: JSON.stringify({ givenSlug }),
      });
      if (check.success) {
        setGivenValidSlug(givenSlug);
      } else {
        setError(check.error);
      }
    } catch (e) {
      setError("Something is off!!");
    }
  };

  const handlePayment = async () => {
    if (!email) {
      setError("Email is required to receive site access");
      return;
    }

    if (plan === "custom" && !customDomain) {
      setError("Please enter your custom domain");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await api("/site/create-order", {
        method: "POST",
        body: JSON.stringify({ siteId, plan }),
      });
      if (order.plan === "paid") {
        const razorpay = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_key",
          amount: order.amount,
          currency: order.currency,
          name: "SiteForge",
          description: `Publish ${siteData.content.name}`,
          order_id: order.orderId,
          handler: async (response) => {
            try {
              const result = await api("/site/publish", {
                method: "POST",
                body: JSON.stringify({
                  siteId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan,
                  customDomain: plan === "custom" ? customDomain : null,
                  email,
                }),
              });
              onPublished(result);
            } catch (err) {
              setError("Payment verification failed. Please contact support.");
            }
          },
          prefill: { email },
          theme: { color: "#7C3AED" },
        });

        razorpay.open();
      } else {
        try {
          const result = await api("/site/publish", {
            method: "POST",
            body: JSON.stringify({
              siteId,
              plan,
              customDomain: plan === "custom" ? customDomain : null,
              email,
              givenSlug: givenValidSlug,
            }),
          });
          onPublished(result);
        } catch (err) {
          setError("Payment verification failed. Please contact support.");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // Demo mode
  const handleDemoPublish = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const slug =
        siteData.content.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 20) +
        "-" +
        Math.random().toString(36).slice(2, 8);

      onPublished({
        slug,
        url: `${window.location.origin}/s/${slug}`,
        customDomain: plan === "custom" ? customDomain : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl h-[90%] p-0 overflow-scroll border-none">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Publish Your Site
            </DialogTitle>
            <DialogDescription className="text-purple-100 mt-1">
              Choose a plan to make your website live instantly
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-4">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  plan === p.id
                    ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                disabled={p.disabled}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
                    Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {p.price}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      plan === p.id
                        ? "bg-purple-500 border-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {plan === p.id && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">{p.description}</p>

                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <f.icon className="w-4 h-4 text-purple-500" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Custom Domain Input */}
          {plan === "custom" && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <Label
                htmlFor="customDomain"
                className="text-sm font-medium text-gray-700"
              >
                Your Domain
              </Label>
              <Input
                id="customDomain"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="yourbrand.com"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll provide DNS setup instructions after publishing
              </p>
            </div>
          )}
          {plan === "basic" && (
            <div
              className="bg-gray-50 p-4 rounded-xl"
              style={{
                backgroundColor: givenValidSlug ? "#abf7b1" : undefined,
              }}
            >
              <div className="flex justify-between aline-center items-center gap-5">
                <Input
                  id="givenSlug"
                  value={givenSlug}
                  onChange={(e) => {
                    const value = e.target.value
                      .toLowerCase() // no capitals
                      .replace(/\s+/g, "-") // spaces → hyphen
                      .replace(/[^a-z0-9-]/g, "") // remove invalid chars
                      .replace(/-+/g, "-"); // avoid multiple hyphens
                    setGivenSlug(value);
                    setGivenValidSlug("");
                    setError("");
                  }}
                  placeholder="your-slug"
                  className=""
                />
                {givenValidSlug ? (
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    ✅ Slug is available
                  </Button>
                ) : (
                  <Button onClick={checkSlugAvailability}>
                    Check Availability
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              We'll send your site URL and access credentials here
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 h-12">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Pay {plan === "basic" ? "₹0" : "₹1000"}
                </>
              )}
            </Button>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant Publish
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
