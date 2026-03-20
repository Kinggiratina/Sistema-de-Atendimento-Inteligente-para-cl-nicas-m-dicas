import axios from 'axios';
import { WEATHER_API_KEY, WEATHER_DEFAULT_CITY } from '../config/env.js';

const hasRain = (weatherArray = []) =>
  weatherArray.some((w) => w.main?.toLowerCase().includes('rain') || w.description?.toLowerCase().includes('chuva'));

export const fetchRainForecast = async ({ city, date }) => {
  if (!WEATHER_API_KEY) {
    return { rainExpected: false, description: 'Sem chave de API de clima configurada' };
  }

  const targetDate = new Date(date);
  if (Number.isNaN(targetDate)) {
    throw new Error('Data inválida para previsão de clima');
  }

  const q = city || WEATHER_DEFAULT_CITY;
  const url = `https://api.openweathermap.org/data/2.5/forecast`;
  const { data } = await axios.get(url, {
    params: {
      q,
      units: 'metric',
      lang: 'pt_br',
      appid: WEATHER_API_KEY
    },
    timeout: 8000
  });

  const targetDay = targetDate.toISOString().slice(0, 10);
  const sameDay = data.list.filter((item) => item.dt_txt.startsWith(targetDay));

  const rainExpected = sameDay.some((item) => hasRain(item.weather) || item.rain?.['3h']);
  const description = sameDay[0]?.weather?.[0]?.description || 'Sem previsão detalhada';
  const temperature = sameDay[0]?.main?.temp;

  return { rainExpected, description, temperature };
};
