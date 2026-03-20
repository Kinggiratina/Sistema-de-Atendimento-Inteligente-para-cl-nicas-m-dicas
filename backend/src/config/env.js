import dotenv from 'dotenv';

dotenv.config();

export const {
PORT=4000
MONGO_URI=mongodb+srv://mongodb+srv://josecarlosjcsjc0_db_user:<db_password>@cluster0.3r8vu1i.mongodb.net/
JWT_SECRET=uma_chave_bem_segura_aqui
WEATHER_API_KEY=sua_chave_openweather
WEATHER_DEFAULT_CITY=Sao Paulo,BR
CLIENT_ORIGIN=http://localhost:5173
} = process.env;
