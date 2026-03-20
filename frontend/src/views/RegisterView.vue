<template>
  <div class="grid-2">
    <div class="card">
      <h2>Criar conta</h2>
      <p class="muted">Cadastre pacientes ou secretários</p>
      <form @submit.prevent="handleRegister">
        <label>
          Nome
          <input v-model="form.name" required autocomplete="name" />
        </label>
        <label>
          E-mail
          <input v-model="form.email" type="email" required autocomplete="email" />
        </label>
        <label>
          Senha
          <input v-model="form.password" type="password" required minlength="6" autocomplete="new-password" />
        </label>
        <label>
          Perfil
          <select v-model="form.role">
            <option value="patient">Paciente</option>
            <option value="secretary">Secretário</option>
          </select>
        </label>
        <button class="primary" :disabled="loading">Cadastrar</button>
        <p v-if="error" class="alert error">{{ error }}</p>
      </form>
      <p class="muted">Já tem conta? <RouterLink to="/login">Entrar</RouterLink></p>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { register } from '../api/auth';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'patient'
});

const emit = defineEmits(['session-change']);

const handleRegister = async () => {
  error.value = '';
  loading.value = true;
  try {
    await register(form);
    emit('session-change');
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar';
  } finally {
    loading.value = false;
  }
};
</script>
