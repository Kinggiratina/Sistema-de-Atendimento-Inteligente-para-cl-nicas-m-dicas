import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import cepRoutes from './routes/cepRoutes.js';
import { CLIENT_ORIGIN } from './config/env.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN.split(','),
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Muitas requisições. Tente novamente em alguns minutos.'
});
app.use('/api', apiLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cep', cepRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erro interno do servidor' });
});

export default app;
