import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fetchAddressByCep } from '../services/cepService.js';
import { fetchRainForecast } from '../services/weatherService.js';

export const createAppointment = asyncHandler(async (req, res) => {
  const { dateTime, reason, cep, number, complement } = req.body;
  const parsedDate = new Date(dateTime);

  if (Number.isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Data ou horário inválidos' });
  }
  if (parsedDate < new Date()) {
    return res.status(400).json({ message: 'Não é possível agendar no passado' });
  }

  const existing = await Appointment.findOne({ dateTime: parsedDate, status: { $ne: 'cancelled' } });
  if (existing) {
    return res.status(409).json({ message: 'Horário indisponível' });
  }

  let address;
  if (cep) {
    address = await fetchAddressByCep(cep);
    address.number = number;
    address.complement = complement;
  }

  const weather = await fetchRainForecast({
    city: address?.city,
    date: parsedDate
  }).catch(() => ({ rainExpected: false, description: 'Não foi possível obter previsão' }));

  const appointment = await Appointment.create({
    patient: req.user._id,
    dateTime: parsedDate,
    reason,
    address,
    weather
  });

  return res.status(201).json(appointment);
});

export const listAppointments = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'secretary' ? {} : { patient: req.user._id };
  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email role')
    .sort({ dateTime: 1 });
  res.json(appointments);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id).populate('patient', 'id name email');
  if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });

  const isOwner = appointment.patient._id.toString() === req.user._id.toString();
  const canModify = req.user.role === 'secretary' || isOwner;
  if (!canModify) return res.status(403).json({ message: 'Sem permissão para alterar' });

  if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  appointment.status = status;
  await appointment.save();
  res.json(appointment);
});

export const getAvailability = asyncHandler(async (req, res) => {
  const { dateTime } = req.query;
  if (!dateTime) return res.status(400).json({ message: 'Informe dateTime' });
  const parsed = new Date(dateTime);
  const conflict = await Appointment.exists({ dateTime: parsed, status: { $ne: 'cancelled' } });
  res.json({ available: !conflict });
});
