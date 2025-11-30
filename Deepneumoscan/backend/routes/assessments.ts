import { Router } from 'express';
import Assessment from '../models/Assessment';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { type, answers, score, riskLevel } = req.body;
    const assessment = new Assessment({
      userId: req.user!.id,
      type,
      answers,
      score,
      riskLevel,
    });
    await assessment.save();
    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Assessment.deleteOne({
      _id: req.params.id,
      userId: req.user!.id,
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;