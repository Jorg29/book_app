<template>
  <div class="wrapper">
    <button class="close-button" @click="goBack">&times;</button>
    <div class="logo">
      <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
    </div>
    <div class="text-center mt-4 name">
      Login
    </div>
    <form @submit.prevent="login" class="p-3 mt-3">
      <div class="form-field d-flex align-items-center">
        <span class="far fa-user"></span>
        <input v-model="username" type="text" name="username" id="username" class="form-control smaller-input" placeholder="Username" required autofocus>
      </div>
      <div class="form-field d-flex align-items-center mb-2">
        <span class="fas fa-key"></span>
        <input v-model="password" type="password" name="password" id="password" class="form-control smaller-input" placeholder="Password" required>
      </div>
      <button class="btn mt-3 btn-primary btn-block" type="submit" :disabled="loading">Login</button>
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    </form>
    <div class="text-center fs-6 mt-3">
      <router-link to="/password-reset">Forgot password?</router-link> or <router-link to="/register">Sign up</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import axiosInstance from '@/axios-auth';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await axiosInstance.post('/token/', {
          username: this.username,
          password: this.password
        });
        if (!response.data.access) {
          throw new Error('Login failed');
        }
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        this.username = '';
        this.password = '';

        this.$router.push('/bookslist'); 
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push('/');
    }
  }
});
</script>

<style scoped>
@import '@/assets/css/login.css';
</style>
