import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import hostRoutes from './routes/host';
import { setSocketServer } from './scheduler/pollScheduler';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use('/api', hostRoutes);

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('join', (sessionId: string) => {
    socket.join(sessionId);
  });
});

setSocketServer(io);
connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));