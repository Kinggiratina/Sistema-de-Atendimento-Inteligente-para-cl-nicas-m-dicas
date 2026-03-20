import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 4000,
  MONGO_URI,
  JWT_SECRET,
  WEATHER_API_KEY,
  WEATHER_DEFAULT_CITY = 'Sao Paulo,BR',
  CLIENT_ORIGIN = 'http://localhost:5173'
} = process.env;
