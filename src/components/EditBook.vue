<template>
  <div class="wrapper">
    <div class="logo">
      <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
    </div>
    <div class="text-center mt-4 name">
      Edit Book
    </div>
    <form @submit.prevent="updateBook" class="p-3 mt-3">
      <div class="form-field">
        <label for="title" class="form-label">Title</label>
        <input v-model="book.title" type="text" id="title" name="title" class="form-control smaller-input" placeholder="Enter book title" required>
      </div>
      <div class="form-field">
        <label for="author" class="form-label">Author</label>
        <input v-model="book.author" type="text" id="author" name="author" class="form-control smaller-input" placeholder="Enter author name" required>
      </div>
      <div class="form-field">
        <label for="genre" class="form-label">Genre</label>
        <input v-model="book.genre" type="text" id="genre" name="genre" class="form-control smaller-input" placeholder="Enter book genre" required>
      </div>
      <div class="form-field">
        <label for="description" class="form-label">Description</label>
        <textarea v-model="book.description" id="description" name="description" class="form-control smaller-input" placeholder="Enter book description" required></textarea>
      </div>
      <div>
        <label for="publicationDate" class="form-label">Publication Date</label>
        <vue-date-picker
          class="small-date-picker"
          v-model="book.publication_date"
          locale="en-GB"
          :model-type="'yyyy-MM-dd'"
          :format="'dd/MM/yyyy'"
          id="publicationDate"
          name="publicationDate"
          required
        ></vue-date-picker>
      </div>
      <button class="btn mt-3 btn-primary btn-block" type="submit">Update Book</button>
      <button class="back-button" @click="goBack">
        <span class="fas fa-arrow-left"></span> Back to Books List
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import axiosInstance from '@/axios-auth';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { defineComponent } from 'vue';

interface Book {
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  description: string;
}

export default defineComponent({
  components: {
    VueDatePicker,
  },
  data() {
    return {
      book: {
        title: '',
        author: '',
        genre: '',
        publication_date: '',
        description: ''
      } as Book
    };
  },
  created() {
    this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      const bookId: string = this.$route.params.id as string;
      try {
        const response = await axiosInstance.get(`books/${bookId}`);
        // Convert date from backend to DD/MM/YYYY format for the date picker
        this.book.publication_date = this.formatDateToInput(response.data.publication_date);
        this.book = response.data;
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    async updateBook() {
      const bookId: string = this.$route.params.id as string;
      try {
        const formattedDate = this.formatInputToDate(this.book.publication_date);
        await axiosInstance.put(`books/${bookId}/`, {
          ...this.book,
          publication_date: formattedDate
        });
        this.$router.push('/bookslist');
      } catch (error) {
        console.error('Error updating book:', error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    formatDateToInput(dateString: string): string {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    },
    formatInputToDate(dateString: string): string {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
  }
});
</script>

<style scoped>
@import '@/assets/css/editbook.css';
</style>
