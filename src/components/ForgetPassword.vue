<template>
    <div class="wrapper">
      <button class="close-button" @click="goBack">&times;</button>
      <div class="logo">
        <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
      </div>
      <div class="text-center mt-4 name">
        Forget Password
      </div>
      <form @submit.prevent="submitForm" class="p-3 mt-3">
        <div class="form-field">
          <span class="fas fa-envelope"></span>
          <input v-model="form.email" type="email" name="email" id="email" class="form-control" placeholder="Email" required>
        </div>
        <button class="btn mt-3 btn-primary btn-block" type="submit">Reset Password</button>
      </form>
      <div class="text-center fs-6 mt-3">
        <router-link to="/login">Back to Login</router-link> or <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import axiosInstance from '@/axios-auth';
import { AxiosError } from 'axios';
import { defineComponent } from 'vue';
  
  interface Form {
    email: string;
  }
  
  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }
  
  export default defineComponent({
    data() {
      return {
        form: {
          email: ''
        } as Form
      };
    },
    methods: {
      async submitForm() {
        try {
          await axiosInstance.post('password-reset/', this.form);
          alert('Password reset link sent to your email.');
        } catch (error: unknown) {
          if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data as { error?: string; message?: string } | undefined;
            alert(`Error requesting password reset: ${errorMessage?.error || errorMessage?.message || 'An unexpected error occurred.'}`);
          } else {
            alert('An unexpected error occurred.');
          }
        }
      },
      goBack() {
        this.$router.push('/');
      }
    }
  });
  </script>
  
  <style scoped>
  @import '@/assets/css/forgetpassword.css';
  </style>
  