<template>
  <div class="wrapper">
    <div class="logo">
      <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
    </div>
    <div class="text-center mt-4 name">
      Confirm Deletion
    </div>
    <div class="confirmation-text mt-4">
      <p v-if="book.title">Are you sure you want to delete "{{ book.title }}"?</p>
      <p v-else>Loading book details...</p>
    </div>
    <div class="button-group p-3 mt-3">
      <button @click="deleteBook" class="btn btn-success mr-2" :disabled="!book.title">Yes</button>
      <button @click="goBack" class="btn btn-danger ml-2">No</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Book {
  id: string;
  title: string;
}

export default defineComponent({
  data() {
    return {
      book: {} as Book,
    };
  },
  methods: {
    async fetchBookDetails() {
      const bookId: string = this.$route.params.id as string;
      try {
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch book with ID ${bookId}`);
        }
        const data = await response.json();
        this.book = data;
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    async deleteBook() {
      const bookId: string = this.$route.params.id as string;
      try {
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to delete book with ID ${bookId}`);
        }
        this.$router.push('/bookslist');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.fetchBookDetails();
  }
});
</script>

<style scoped>
@import '@/assets/css/deletebook.css';
</style>
