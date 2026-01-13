import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  magicLinkToken: {
    type: String,
    default: null
  },
  magicLinkExpiry: {
    type: Date,
    default: null
  },
  sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
