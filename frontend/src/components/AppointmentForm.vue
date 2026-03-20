<template>
  <div>
    <div v-if="alert.message" class="alert" :class="alert.type">{{ alert.message }}</div>
    <form @submit.prevent="handleSubmit">
      <label>
        Data e horário
        <input v-model="form.dateTime" type="datetime-local" required @blur="handleAvailability" />
        <small v-if="availability !== null" :class="availability ? 'badge success' : 'badge danger'">
          {{ availability ? 'Horário livre' : 'Horário ocupado' }}
        </small>
      </label>
      <label>
        Motivo
        <textarea v-model="form.reason" rows="2" required placeholder="Consulta, retorno, exame..." />
      </label>
      <div class="grid-2">
        <label>
          CEP
          <input v-model="form.cep" placeholder="00000-000" maxlength="9" @blur="handleCep" />
        </label>
        <label>
          Número
          <input v-model="form.number" />
        </label>
      </div>
      <label>
        Complemento
        <input v-model="form.complement" />
      </label>
      <p v-if="addressSummary" class="muted">Endereço: {{ addressSummary }}</p>
      <button class="primary" :disabled="loading">Agendar</button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import {
  checkAvailability,
  createAppointment,
  fetchAddress
} from '../api/appointments';

const emit = defineEmits(['created']);
const loading = ref(false);
const availability = ref(null);
const alert = reactive({ message: '', type: 'error' });

const form = reactive({
  dateTime: '',
  reason: '',
  cep: '',
  number: '',
  complement: ''
});

const address = ref(null);

const addressSummary = computed(() => {
  if (!address.value) return '';
  const { street, neighborhood, city, state } = address.value;
  return `${street}, ${neighborhood} - ${city}/${state}`;
});

const handleCep = async () => {
  alert.message = '';
  address.value = null;
  const cep = form.cep?.trim();
  if (!cep || cep.replace(/\D/g, '').length < 8) return;
  try {
    address.value = await fetchAddress(cep);
  } catch (err) {
    alert.message = err.response?.data?.message || 'CEP não encontrado';
    alert.type = 'error';
  }
};

const handleAvailability = async () => {
  if (!form.dateTime) return;
  availability.value = null;
  try {
    availability.value = await checkAvailability(form.dateTime);
  } catch (err) {
    availability.value = null;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  alert.message = '';
  try {
    const payload = { ...form };
    const appointment = await createAppointment(payload);
    emit('created', appointment);
    alert.message = appointment.weather?.rainExpected
      ? 'Agendado! Atenção: previsão de chuva no dia.'
      : 'Agendamento criado com sucesso.';
    alert.type = appointment.weather?.rainExpected ? 'warning' : 'success';
    form.reason = '';
  } catch (err) {
    alert.message = err.response?.data?.message || 'Não foi possível agendar';
    alert.type = 'error';
  } finally {
    loading.value = false;
  }
};
</script>
