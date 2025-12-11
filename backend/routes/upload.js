const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/gig-images',
    'uploads/gig-videos',
    'uploads/gig-pdfs'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure multer storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gig-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gig-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer storage for PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gig-pdfs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filters
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

// Multer upload configurations
const uploadImages = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image
  },
  fileFilter: imageFilter
});

const uploadPDF = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per PDF
  },
  fileFilter: pdfFilter
});

// Upload multiple images
router.post('/images', uploadImages.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const filePaths = req.files.map(file => `/uploads/gig-images/${file.filename}`);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      filePaths
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images'
    });
  }
});

// Upload single PDF
router.post('/pdf', uploadPDF.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF uploaded'
      });
    }

    res.json({
      success: true,
      message: 'PDF uploaded successfully',
      filePath: `/uploads/gig-pdfs/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload PDF'
    });
  }
});

// Delete uploaded file
router.delete('/file', (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    const fullPath = path.join(__dirname, '../', filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 images'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Upload failed'
  });
});

module.exports = router;