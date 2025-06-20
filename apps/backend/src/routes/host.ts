import express from 'express';
import { HostSetting } from '../models/HostSetting';
import { startPollScheduler } from '../scheduler/pollScheduler';

const router = express.Router();
router.post('/host/settings', async (req, res) => {
  const data = req.body;
  try {
    await HostSetting.findOneAndUpdate(
      { sessionId: data.sessionId },
      data,
      { upsert: true, new: true }
    );
    startPollScheduler(data.sessionId);
    res.json({ message: 'Settings saved and scheduler started.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});
export default router;