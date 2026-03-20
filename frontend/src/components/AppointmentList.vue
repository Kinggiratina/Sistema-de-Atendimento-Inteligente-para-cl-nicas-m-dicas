<template>
  <div>
    <p v-if="loading" class="muted">Carregando agendamentos...</p>
    <p v-else-if="!appointments.length" class="muted">Nenhum agendamento encontrado.</p>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Data</th>
          <th v-if="isSecretary">Paciente</th>
          <th>Motivo</th>
          <th>Clima</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appt in appointments" :key="appt._id">
          <td>
            <div>{{ formatDate(appt.dateTime) }}</div>
            <div v-if="appt.address" class="muted" style="font-size: 0.85rem;">
              {{ appt.address.city }}/{{ appt.address.state }}
            </div>
          </td>
          <td v-if="isSecretary">{{ appt.patient?.name || 'Paciente' }}</td>
          <td>{{ appt.reason }}</td>
          <td>
            <span class="badge" :class="appt.weather?.rainExpected ? 'danger' : 'info'">
              {{ appt.weather?.rainExpected ? 'Chuva prevista' : 'Sem chuva' }}
            </span>
            <div v-if="appt.weather?.description" class="muted" style="font-size: 0.85rem;">
              {{ appt.weather.description }}
            </div>
          </td>
          <td>
            <span class="badge" :class="statusClass(appt.status)">{{ statusLabel(appt.status) }}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button
                v-if="canComplete(appt)"
                class="primary"
                @click="emitStatus(appt._id, 'completed')"
              >
                Concluir
              </button>
              <button
                v-if="canCancel(appt)"
                class="ghost"
                @click="emitStatus(appt._id, 'cancelled')"
              >
                Cancelar
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { currentUser } from '../api/auth';

const props = defineProps({
  appointments: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['status-change', 'refresh']);

const user = currentUser();
const isSecretary = computed(() => user?.role === 'secretary');

const formatDate = (value) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));

const statusLabel = (status) =>
  ({
    scheduled: 'Agendado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }[status] || status);

const statusClass = (status) =>
  ({
    scheduled: 'info',
    completed: 'success',
    cancelled: 'danger'
  }[status] || 'info');

const canComplete = (appt) => isSecretary.value && appt.status === 'scheduled';

const canCancel = (appt) => {
  if (appt.status !== 'scheduled') return false;
  if (isSecretary.value) return true;
  const patientId = appt.patient?._id || appt.patient?.id;
  return patientId === user?.id;
};

const emitStatus = (id, status) => emit('status-change', { id, status });
</script>
