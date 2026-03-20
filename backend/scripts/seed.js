import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Appointment from '../src/models/Appointment.js';

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Appointment.deleteMany({});

  const password = await bcrypt.hash('senha123', 10);

  const [secretary, patient] = await User.insertMany([
    { name: 'Secretária Ana', email: 'secretaria@clinica.com', password, role: 'secretary' },
    { name: 'Paciente João', email: 'paciente@clinica.com', password, role: 'patient' }
  ]);

  const tomorrow9am = new Date();
  tomorrow9am.setDate(tomorrow9am.getDate() + 1);
  tomorrow9am.setHours(9, 0, 0, 0);

  await Appointment.create({
    patient: patient._id,
    dateTime: tomorrow9am,
    reason: 'Consulta inicial',
    address: {
      cep: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP'
    },
    weather: {
      rainExpected: false,
      description: 'Sem previsão de chuva seed'
    }
  });

  console.log('Seed concluído:');
  console.log('- Usuário secretário: secretaria@clinica.com / senha123');
  console.log('- Usuário paciente: paciente@clinica.com / senha123');
  console.log('- 1 agendamento criado para amanhã às 09:00');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
