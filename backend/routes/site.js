import { Router } from "express";
import { nanoid } from "nanoid";
import Razorpay from "razorpay";
import Site from "../models/Site.js";
import User from "../models/User.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { ensureUniqueSlug } from "../utils/slug.js";

const router = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test",
});

// POST /site/preview - Save draft (no auth required)
router.post("/preview", optionalAuth, async (req, res) => {
  try {
    const { siteId, draftToken, type, content, colors, sections } = req.body;

    let site;

    // Check if updating existing draft
    if (siteId) {
      site = await Site.findById(siteId);
      if (!site) {
        return res.status(404).json({ error: "Site not found" });
      }
    } else if (draftToken) {
      site = await Site.findOne({ draftToken });
    }

    if (site) {
      // Update existing site
      site.type = type;
      site.content = content;
      site.colors = colors;
      site.sections = sections;
      await site.save();
    } else {
      // Create new draft
      const newDraftToken = nanoid(16);
      site = new Site({
        type,
        content,
        colors,
        sections,
        draftToken: newDraftToken,
        owner: req.user?._id || null,
      });
      await site.save();

      // Link to user if authenticated
      if (req.user) {
        req.user.sites.push(site._id);
        await req.user.save();
      }
    }

    res.json({
      siteId: site._id,
      draftToken: site.draftToken,
      message: "Draft saved",
    });
  } catch (err) {
    console.error("Preview save error:", err);
    res.status(500).json({ error: "Failed to save draft" });
  }
});

// GET /site/draft/:token - Get draft by token
router.get("/draft/:token", async (req, res) => {
  try {
    const site = await Site.findOne({ draftToken: req.params.token });

    if (!site) {
      return res.status(404).json({ error: "Draft not found" });
    }

    res.json(site);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch draft" });
  }
});

// POST /site/create-order - Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { siteId, plan } = req.body;

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    if (site.published) {
      return res.status(400).json({ error: "Site is already published" });
    }

    const amount = plan === "custom" ? 100000 : null; // Amount in paise
    let order;
    if (plan === "custom") {
      order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `site_${siteId}`,
        notes: {
          siteId,
          plan,
        },
      });
    } else {
      order = {
        id: `free-${Date.now}`,
        amount: "000",
        currency: "Inr",
      };
    }

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plan === "custom" ? "paid" : "free",
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// POST /site/checkavailability
router.post("/checkavailability", async (req, res) => {
  try {
    const { givenSlug } = req.body;
    const exists = await Site.findOne({ slug: givenSlug });
    if (exists) {
      return res.json({ success: false, error: "This slug is already taken." });
    }
    return res.json({
      message: "Slug is available.",
      success: true,
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to check slug" });
  }
});

// POST /site/publish - Verify payment and publish
router.post("/publish", async (req, res) => {
  try {
    const {
      siteId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      customDomain,
      email,
      givenSlug,
    } = req.body;

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    const crypto = await import("crypto");

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      // Verify payment signature
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }
    }

    let slug;
    if (givenSlug) {
      slug = givenSlug;
    } else {
      slug = await ensureUniqueSlug(site.content.name);
    }
    // Generate unique slug

    // Update site
    site.published = true;
    site.slug = slug;
    site.paymentId = razorpay_payment_id || "freePlan";
    site.paymentPlan = plan;

    if (plan === "custom" && customDomain) {
      site.customDomain = customDomain.toLowerCase().trim();
    }

    await site.save();

    // If email provided and no owner, create/link user
    if (email && !site.owner) {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        user = new User({ email: email.toLowerCase() });
      }
      user.sites.push(site._id);
      await user.save();

      site.owner = user._id;
      await site.save();
    }

    res.json({
      message: "Site published successfully",
      slug: site.slug,
      url: `${process.env.FRONTEND_URL}/s/${site.slug}`,
      customDomain: site.customDomain,
    });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({ error: "Failed to publish site" });
  }
});

// GET /site/:slug - Public site
router.get("/:slug", async (req, res) => {
  try {
    const site = await Site.findOne({
      $or: [
        { slug: req.params.slug, published: true },
        { customDomain: req.params.slug, published: true },
      ],
    });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    res.json(site);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch site" });
  }
});

export default router;
