import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['personal', 'brand'],
    required: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  // Core content
  content: {
    name: { type: String, required: true },
    tagline: String,
    // Personal specific
    profilePhoto: String,
    bio: String,
    // Brand specific
    logo: String,
    description: String
  },
  // Colors
  colors: {
    primary: { type: String, default: '#3B82F6' },
    secondary: { type: String, default: '#1E40AF' }
  },
  // Optional sections - only rendered if data exists
  sections: {
    gallery: {
      enabled: { type: Boolean, default: false },
      images: [String]
    },
    videos: {
      enabled: { type: Boolean, default: false },
      links: [String]
    },
    services: {
      enabled: { type: Boolean, default: false },
      items: [{
        title: String,
        description: String,
        price: String
      }]
    },
    location: {
      enabled: { type: Boolean, default: false },
      address: String,
      mapLink: String
    },
    founder: {
      enabled: { type: Boolean, default: false },
      name: String,
      photo: String,
      bio: String
    },
    social: {
      enabled: { type: Boolean, default: false },
      links: {
        instagram: String,
        twitter: String,
        linkedin: String,
        facebook: String,
        youtube: String,
        website: String
      }
    },
    cta: {
      enabled: { type: Boolean, default: false },
      whatsapp: String,
      phone: String
    }
  },
  // Publishing
  published: {
    type: Boolean,
    default: false
  },
  customDomain: {
    type: String,
    default: null
  },
  // Payment
  paymentId: String,
  paymentPlan: {
    type: String,
    enum: ['basic', 'custom'],
    default: null
  },
  // Owner (linked after auth)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Draft token for anonymous users
  draftToken: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

siteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Site', siteSchema);
