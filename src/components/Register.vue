<template>
  <div class="register-container">
    <div class="wrapper">
      <button class="close-button" @click="goBack">&times;</button>
      <div class="logo">
        <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="Logo">
      </div>
      <div class="name">Register</div>
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-field form-group">
          <label for="username"><span class="fas fa-user"></span></label>
          <input v-model="username" id="username" placeholder="Username" required />
        </div>
        <div class="form-field form-group">
          <label for="email"><span class="fas fa-envelope"></span></label>
          <input v-model="email" id="email" type="email" placeholder="Email" required />
        </div>
        <div class="form-field form-group">
          <label for="password"><span class="fas fa-lock"></span></label>
          <input v-model="password" id="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn register-button" :disabled="loading">Register</button>
        <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      </form>
      <div class="text-center fs-6 mt-3">
        Already have an account? <router-link to="/login">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();

    const handleSubmit = async () => {
      if (!username.value || !email.value || !password.value) {
        errorMessage.value = 'Please fill in all fields.';
        return;
      }

      loading.value = true;
      errorMessage.value = '';

      try {
        const response = await fetch('http://192.168.1.51:8000/api/auth/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Registration successful:', data);

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        router.push('/login');

        username.value = '';
        email.value = '';
        password.value = '';
      } catch (error) {
        console.error('Registration error:', error);
        errorMessage.value = 'Registration failed. Please try again.';
      } finally {
        loading.value = false;
      }
    };
    const goBack = () => {
      router.push('/');
    };
    return {
      username,
      email,
      password,
      loading,
      errorMessage,
      handleSubmit,
      goBack,
    };
  }
});
</script>

<style scoped>
@import '@/assets/css/register.css';
</style>
