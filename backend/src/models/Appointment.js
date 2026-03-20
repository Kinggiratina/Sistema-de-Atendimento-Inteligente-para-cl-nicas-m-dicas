import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    cep: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String
  },
  { _id: false }
);

const weatherSchema = new mongoose.Schema(
  {
    rainExpected: { type: Boolean, default: false },
    description: String,
    temperature: Number
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    address: addressSchema,
    weather: weatherSchema
  },
  { timestamps: true }
);

appointmentSchema.index({ patient: 1, dateTime: 1 }, { unique: true });

export default mongoose.model('Appointment', appointmentSchema);
