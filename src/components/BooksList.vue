<template>
  <div class="blur-background">
    <div class="background-container">
      <div class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
    </div>
    <div class="content">
      <div class="top-menu">
        <div class="menu-button-container">
          <button @click="toggleDropdown" class="menu-button">Menu</button>
          <div v-if="dropdownOpen" class="dropdown-content">
            <button @click="logoutUser" class="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
      <h1>Welcome to our booklist!</h1>
      <p>
        Explore our collection of books, manage and find your next
        favorite read.
      </p>
      <div class="search-filter">
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="Search books by title, author, or genre...">
          <i class="fas fa-search"></i>
        </div>
        <div class="filter">
          <select v-model="selectedFilter">
            <option value="">Filter by Date</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <button @click="navigateToAddBook" class="add-button">Add Book</button>
      </div>
      <table class="book-list">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>
              <router-link :to="'/book/' + book.id">
                {{ book.title }}
              </router-link>
            </td>
            <td>{{ book.author }}</td>
            <td>{{ book.genre }}</td>
            <td>{{ book.publicationDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import axiosInstance from '@/axios-auth';
import { defineComponent } from 'vue';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
}

export default defineComponent({
  name: 'BookList',
  data() {
    return {
      books: [] as Book[],
      searchQuery: '',
      selectedFilter: '',
      dropdownOpen: false,
    };
  },
  computed: {
    filteredBooks(): Book[] {
      return this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  watch: {
    selectedFilter: 'fetchBooks'
  },
  methods: {
    async fetchBooks() {
      try {
        let url = '/books/';
        if (this.selectedFilter === 'newest') {
          url += '?ordering=-publication_date';
        } else if (this.selectedFilter === 'oldest') {
          url += '?ordering=publication_date';
        }
        const response = await axiosInstance.get(url);
        this.books = response.data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          publicationDate: book.publication_date
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    navigateToAddBook() {
      this.$router.push('/addbook');
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    async logoutUser() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.$router.push('/login');
      this.dropdownOpen = false;
    }
  },
  created() {
    this.fetchBooks();
  }
});
</script>

<style scoped>
@import '@/assets/css/booklist.css';
</style>
