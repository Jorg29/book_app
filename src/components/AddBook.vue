<template>
  <div class="wrapper">
    <div class="logo">
      <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="Logo">
    </div>
    <div class="text-center mt-4 name">
      Add New Book
    </div>
    <form @submit.prevent="addBook" class="p-3 mt-3">
      <div class="form-field">
        <label for="title">Title</label>
        <input v-model="formData.title" type="text" id="title" name="title" class="form-control smaller-input" placeholder="Enter book title" required>
      </div>
      <div class="form-field">
        <label for="author">Author</label>
        <input v-model="formData.author" type="text" id="author" name="author" class="form-control smaller-input" placeholder="Enter author name" required>
      </div>
      <div class="form-field">
        <label for="genre">Genre</label>
        <input v-model="formData.genre" type="text" id="genre" name="genre" class="form-control smaller-input" placeholder="Enter book genre" required>
      </div>
      <div class="form-field">
        <label for="description">Description</label>
        <textarea v-model="formData.description" id="description" name="description" class="form-control smaller-input" placeholder="Enter book description" required></textarea>
      </div>
      <div>
        <label for="publicationDate">Publication Date</label>
        <vue-date-picker
          class="small-date-picker"
          v-model="formData.publicationDate"
          locale="en-GB"
          :model-type="'yyyy-MM-dd'"
          :format="'dd/MM/yyyy'"
          id="publicationDate"
        ></vue-date-picker>
      </div>
      <button class="btn mt-3 btn-primary btn-block" type="submit">Add Book</button>
      <button class="back-button" @click="goBack">
        <span class="fas fa-arrow-left"></span> Back to Books List
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { defineComponent } from 'vue';

interface FormData {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  description: string;
}

export default defineComponent({
  components: {
    VueDatePicker,
  },
  data() {
    return {
      formData: {
        title: '',
        author: '',
        genre: '',
        publicationDate: '',
        description: ''
      } as FormData
    };
  },
  methods: {
    async addBook() {
      const { title, author, genre, publicationDate, description } = this.formData;
      if (!title || !author || !genre || !publicationDate || !description) {
        alert('Please fill in all fields.');
        return;
      }

      const formattedPublicationDate = this.formatDate(publicationDate);

      try {
        const response = await fetch('http://192.168.1.51:8000/api/books/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            title,
            author,
            genre,
            publication_date: formattedPublicationDate,
            description
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Book added successfully:', data);
        this.$router.push('/bookslist');
      } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book. Please try again.');
      }
    },
    formatDate(date: string): string {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
});
</script>

<style scoped>
@import '@/assets/css/addbooks.css';
</style>
