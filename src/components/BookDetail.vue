<template>
  <div class="blur-background">
    <div class="book-detail">
      <div class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <h1>{{ book?.title }}</h1>
      <p><strong>Author:</strong> {{ book?.author }}</p>
      <p><strong>Genre:</strong> {{ book?.genre }}</p>
      <p><strong>Publication Date:</strong> {{ book?.publication_date }}</p>
      <p><strong>Description:</strong> {{ book?.description }}</p>
      <button class="menu-btn" @click="toggleMenu">
        <span></span>
      </button>
      <div class="wrapper" :class="{ 'active': menuOpen }">
        <ul>
          <li><router-link to="/bookslist" class="menu-link">Back</router-link></li>
          <li v-if="book?.id">
            <router-link :to="`/comments/${book.id}`" class="menu-link">Add Comment</router-link>
          </li>
          <li v-if="book?.id">
            <router-link :to="`/editbook/${book.id}`" class="menu-link">Edit Book</router-link>
          </li>
          <li v-if="book?.id">
            <router-link :to="`/deletebook/${book.id}`" class="menu-link">Delete Book</router-link>
          </li>
        </ul>
      </div>
      <div class="comments-section mt-4">
        <h2>Comments</h2>
        <ul class="comments-list" v-if="book && book.comments && book.comments.length > 0">
          <li class="comment-item" v-for="comment in book.comments" :key="comment.id">
            <div class="comment-content">{{ comment.text }}</div>
            <div class="comment-author text-muted">- {{ comment.username }}</div>
            <button @click="deleteComment(comment.id)" class="delete-comment-button">Delete</button>
          </li>
        </ul>
        <p v-else>No comments yet.</p>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

interface Comment {
  id: number;
  text: string;
  username: string; // Updated to use the `username` field
}

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  description: string;
  comments: Comment[];
}

export default defineComponent({
  data() {
    return {
      book: null as Book | null,
      menuOpen: false
    };
  },
  created() {
    this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      const bookId = parseInt(this.$route.params.id as string);
      try {
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.book = await response.json();
        console.log(this.book); // Log the book data for debugging
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    async deleteComment(commentId: number) {
      if (this.book) {
        try {
          const response = await fetch(`http://192.168.1.51:8000/api/comments/${commentId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          if (this.book) {
            this.book.comments = this.book.comments.filter(comment => comment.id !== commentId);
          }
        } catch (error) {
          console.error('Error deleting comment:', error);
        }
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
});
</script>


<style scoped>
@import '@/assets/css/bookdetail.css';
</style>
