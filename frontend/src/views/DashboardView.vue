<template>
  <div class="grid-2">
    <section class="card">
      <header style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
        <div>
          <h2>Painel de agendamentos</h2>
          <p class="muted">Bem-vindo, {{ user?.name }}</p>
        </div>
        <span class="pill">
          <strong>{{ roleLabel }}</strong>
        </span>
      </header>
      <AppointmentForm @created="handleCreated" />
    </section>

    <section class="card">
      <h3>Lista de consultas</h3>
      <p class="muted">Visualize e atualize o status</p>
      <AppointmentList
        :appointments="appointments"
        :loading="loading"
        @refresh="loadAppointments"
        @status-change="handleStatusChange"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppointmentForm from '../components/AppointmentForm.vue';
import AppointmentList from '../components/AppointmentList.vue';
import { listAppointments, updateStatus } from '../api/appointments';
import { currentUser } from '../api/auth';

const appointments = ref([]);
const loading = ref(true);
const user = ref(currentUser());

const roleLabel = computed(() => (user.value?.role === 'secretary' ? 'Secretário' : 'Paciente'));

const loadAppointments = async () => {
  loading.value = true;
  try {
    appointments.value = await listAppointments();
  } catch (error) {
    console.error(error);
    appointments.value = [];
  } finally {
    loading.value = false;
  }
};

const handleCreated = (appointment) => {
  appointments.value = [...appointments.value, appointment].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );
};

const handleStatusChange = async ({ id, status }) => {
  await updateStatus(id, status);
  await loadAppointments();
};

onMounted(loadAppointments);
</script>
