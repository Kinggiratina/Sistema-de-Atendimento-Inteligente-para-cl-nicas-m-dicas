import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createAppointment,
  getAvailability,
  listAppointments,
  updateStatus
} from '../controllers/appointmentController.js';
import { authGuard } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', authGuard, listAppointments);

router.get(
  '/availability',
  [query('dateTime').notEmpty().withMessage('dateTime é obrigatório')],
  validate,
  getAvailability
);

router.post(
  '/',
  authGuard,
  [
    body('dateTime').notEmpty().withMessage('Data e hora são obrigatórias'),
    body('reason').isLength({ min: 3 }).withMessage('Motivo é obrigatório'),
    body('cep').optional().isLength({ min: 8, max: 9 }).withMessage('CEP inválido')
  ],
  validate,
  createAppointment
);

router.put(
  '/:id/status',
  authGuard,
  [body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Status inválido')],
  validate,
  updateStatus
);

export default router;
