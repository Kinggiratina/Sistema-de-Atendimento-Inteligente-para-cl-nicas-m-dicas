<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand" @click="goHome">
        <span class="dot"></span>
        <span>Clínica Inteligente</span>
      </div>
      <nav class="nav">
        <span v-if="user" class="user-chip">
          {{ user.name }} · {{ roleLabel }}
        </span>
        <button v-if="user" class="ghost" @click="logoutUser">Sair</button>
      </nav>
    </header>
    <main class="content">
      <RouterView @session-change="refreshUser" />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import { currentUser, logout } from './api/auth';

const router = useRouter();
const user = ref(currentUser());

const refreshUser = () => {
  user.value = currentUser();
};

const logoutUser = () => {
  logout();
};

const goHome = () => {
  router.push('/dashboard');
};

const roleLabel = computed(() => (user.value?.role === 'secretary' ? 'Secretário' : 'Paciente'));

const handleStorage = () => refreshUser();

onMounted(() => window.addEventListener('storage', handleStorage));
onUnmounted(() => window.removeEventListener('storage', handleStorage));
</script>
