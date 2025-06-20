import mongoose from 'mongoose';
const HostSettingSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  questionFrequency: { type: Number, required: true },
  numberOfQuestions: { type: Number, required: true },
  visibilityTime: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
});
export const HostSetting = mongoose.model('HostSetting', HostSettingSchema);