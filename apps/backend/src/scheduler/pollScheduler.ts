import axios from 'axios';
import { HostSetting } from '../models/HostSetting';
import { getTranscriptForSession } from '../utils/transcript';
import { Server } from 'socket.io';

let io: Server;
const activeSessions = new Map<string, NodeJS.Timeout>();
export const setSocketServer = (ioServer: Server) => { io = ioServer; };

export const startPollScheduler = async (sessionId: string) => {
  if (activeSessions.has(sessionId)) return;
  const settings = await HostSetting.findOne({ sessionId });
  if (!settings) return;
  const interval = setInterval(async () => {
    const transcript = await getTranscriptForSession(sessionId);
    const response = await axios.post('http://localhost:5001/generate', {
      transcript,
      count: settings.numberOfQuestions,
      difficulty: settings.difficulty
    });
    const questions = response.data.questions;
    io.to(sessionId).emit('pollGenerated', { questions, visibilityTime: settings.visibilityTime });
    setTimeout(() => { io.to(sessionId).emit('pollExpired'); }, settings.visibilityTime);
  }, settings.questionFrequency);
  activeSessions.set(sessionId, interval);
};