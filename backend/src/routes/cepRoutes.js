import { Router } from 'express';
import { param } from 'express-validator';
import { fetchAddressByCep } from '../services/cepService.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get(
  '/:cep',
  [param('cep').isLength({ min: 8, max: 9 }).withMessage('CEP inválido')],
  validate,
  async (req, res, next) => {
    try {
      const address = await fetchAddressByCep(req.params.cep);
      res.json(address);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
