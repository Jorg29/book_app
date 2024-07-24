<template>
    <div class="wrapper">
      <button class="close-button" @click="goBack">&times;</button>
      <div class="logo">
        <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
      </div>
      <div class="text-center mt-4 name">
        New Password
      </div>
      <form @submit.prevent="submitForm" class="p-3 mt-3">
        <div class="form-field">
          <span class="fas fa-key"></span>
          <input v-model="form.new_password" type="password" name="new_password" id="new_password" class="form-control" placeholder="New Password" required>
        </div>
        <button class="btn mt-3 btn-primary btn-block" type="submit">Save</button>
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
    new_password: string;
  }
  
  export default defineComponent({
    data() {
      return {
        form: {
          new_password: ''
        } as Form
      };
    },
    methods: {
      async submitForm() {
        try {
          const uid = localStorage.getItem('uid');
          const token = localStorage.getItem('token');
  
          if (!uid || !token) {
            alert('Invalid reset link. Please try again.');
            return;
          }
  
          await axiosInstance.post('password-reset-confirm/', {
            new_password: this.form.new_password,
            uid: uid,
            token: token
          });
  
          alert('Password has been successfully reset.');
          this.$router.push('/login');
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error('Axios error details:', error.response?.data);
            const errorMessage = error.response?.data as { error?: string; message?: string } | undefined;
            alert(`Error resetting password: ${errorMessage?.error || errorMessage?.message || 'An unexpected error occurred.'}`);
          } else {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred.');
          }
        }
      },
      goBack() {
        this.$router.push('/');
      }
    },
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const uid = urlParams.get('uid');
      const token = urlParams.get('token');
  
      if (uid && token) {
        localStorage.setItem('uid', uid);
        localStorage.setItem('token', token);
      } else {
        alert('Invalid reset link. Please try again.');
      }
    }
  });
  </script>
  
  <style scoped>
  @import '@/assets/css/newpassword.css';
  </style>
  