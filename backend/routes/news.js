import express from 'express';
import News from '../models/News.js';

const router = express.Router();

// Get all published news (Public)
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ isPublished: true })
      .populate('author', 'fullName role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(news);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news item (Public)
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findOne({ 
      _id: req.params.id, 
      isPublished: true 
    }).populate('author', 'fullName role');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error('Get single news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;