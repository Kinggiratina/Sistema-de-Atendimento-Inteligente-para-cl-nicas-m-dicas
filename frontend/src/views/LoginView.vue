<template>
  <div class="grid-2">
    <div class="card">
      <h2>Entrar</h2>
      <p class="muted">Acesse o painel da clínica</p>
      <form @submit.prevent="handleLogin">
        <label>
          E-mail
          <input v-model="form.email" type="email" required autocomplete="email" />
        </label>
        <label>
          Senha
          <input v-model="form.password" type="password" required autocomplete="current-password" />
        </label>
        <button class="primary" :disabled="loading">Entrar</button>
        <p v-if="error" class="alert error">{{ error }}</p>
      </form>
      <p class="muted">Novo por aqui? <RouterLink to="/register">Criar conta</RouterLink></p>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { login } from '../api/auth';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const form = reactive({
  email: '',
  password: ''
});

const emit = defineEmits(['session-change']);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await login({ email: form.email, password: form.password });
    emit('session-change');
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Não foi possível autenticar';
  } finally {
    loading.value = false;
  }
};
</script>
