import { Router } from 'express';
import Assessment from '../models/Assessment';
import XrayResult from '../models/XrayResult';
import History from '../models/History'; // Optional: if you want to log history separately
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    const xrayResults = await XrayResult.find({ userId: req.user!.id }).sort({ createdAt: -1 });

    // Optional: Log to History collection
    // Uncomment below if you want to maintain a unified history log
    /*
    for (const a of assessments) {
      await History.create({
        userId: req.user!.id,
        type: 'assessment',
        referenceId: a._id.toString(),
      });
    }
    for (const x of xrayResults) {
      await History.create({
        userId: req.user!.id,
        type: 'xray',
        referenceId: x._id.toString(),
      });
    }
    */

    res.json({
      assessments,
      xrayResults,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;