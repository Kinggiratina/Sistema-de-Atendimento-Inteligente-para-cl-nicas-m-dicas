import api from './client';

export const listAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

export const createAppointment = async (payload) => {
  const { data } = await api.post('/appointments', payload);
  return data;
};

export const updateStatus = async (id, status) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};

export const checkAvailability = async (dateTime) => {
  const { data } = await api.get('/appointments/availability', { params: { dateTime } });
  return data.available;
};

export const fetchAddress = async (cep) => {
  const { data } = await api.get(`/cep/${cep}`);
  return data;
};
