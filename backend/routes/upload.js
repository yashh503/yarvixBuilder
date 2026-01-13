import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for memory storage (we'll process with sharp)
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  },
});

// POST /upload/image - Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { type } = req.body; // 'profile', 'logo', 'gallery', 'founder'

    // Generate unique filename
    const filename = `${nanoid(12)}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with sharp - optimize and convert to webp
    let sharpInstance = sharp(req.file.buffer);

    // Resize based on type
    switch (type) {
      case 'profile':
      case 'founder':
        sharpInstance = sharpInstance.resize(400, 400, { fit: 'cover' });
        break;
      case 'logo':
        sharpInstance = sharpInstance.resize(500, 200, { fit: 'inside', withoutEnlargement: true });
        break;
      case 'gallery':
        sharpInstance = sharpInstance.resize(1200, 1200, { fit: 'inside', withoutEnlargement: true });
        break;
      default:
        sharpInstance = sharpInstance.resize(800, 800, { fit: 'inside', withoutEnlargement: true });
    }

    await sharpInstance
      .webp({ quality: 85 })
      .toFile(filepath);

    const imageUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${filename}`;

    res.json({
      success: true,
      url: imageUrl,
      filename,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// POST /upload/images - Upload multiple images (for gallery)
router.post('/images', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const filename = `${nanoid(12)}.webp`;
      const filepath = path.join(uploadsDir, filename);

      await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filepath);

      const imageUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${filename}`;
      uploadedUrls.push(imageUrl);
    }

    res.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload images' });
  }
});

// DELETE /upload/:filename - Delete an uploaded image
router.delete('/:filename', async (req, res) => {
  try {
    const filepath = path.join(uploadsDir, req.params.filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
