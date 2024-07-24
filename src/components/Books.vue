<template>
  <div class="book-details wrapper">
    <div v-if="book" class="text-center mt-4 name">
      {{ book.title }}
    </div>
    <div v-if="book" class="book-info mt-3">
      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>Genre:</strong> {{ book.genre }}</p>
      <p><strong>Publication Date:</strong> {{ book.publicationDate }}</p>
      <p><strong>Description:</strong> {{ book.description }}</p>
    </div>
    <div class="buttons mt-3">
      <button @click="editBook" class="btn btn-primary btn-block">Edit</button>
      <button @click="deleteBook" class="btn btn-danger btn-block">Delete</button>
      <button @click="showCommentForm = !showCommentForm" class="btn btn-secondary btn-block">Add Comment</button>
    </div>
    <div v-if="showCommentForm" class="mt-3">
      <form @submit.prevent="addComment" class="p-3">
        <div class="form-field d-flex align-items-center">
          <span class="far fa-user"></span>
          <textarea id="comment" v-model="newComment" class="form-control smaller-input" rows="3" placeholder="Add a comment..." required></textarea>
        </div>
        <button type="submit" class="btn mt-3 btn-primary btn-block">Post Comment</button>
      </form>
    </div>
    <hr>
    <div v-if="comments.length > 0">
      <h3>Comments:</h3>
      <ul class="list-group">
        <li class="list-group-item" v-for="(comment, index) in comments" :key="index">
          {{ comment.text }}
          <span class="text-muted"> - {{ comment.owner }}</span>
        </li>
      </ul>
    </div>
    <p v-else>No comments yet.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Comment {
  id: number;
  text: string;
  owner: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  description: string;
}

export default defineComponent({
  data() {
    return {
      book: null as Book | null,
      comments: [] as Comment[],
      newComment: '',
      showCommentForm: false,
    };
  },
  methods: {
    async fetchBook() {
      try {
        const bookId = this.$route.params.id;
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        this.book = await response.json();
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    },
    async fetchComments() {
      try {
        const bookId = this.$route.params.id;
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}/comments/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        this.comments = await response.json();
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      if (this.newComment.trim() === '') return;

      try {
        const bookId = this.$route.params.id;
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}/comments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ text: this.newComment })
        });

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const newCommentObj: Comment = await response.json();
        this.comments.push(newCommentObj);
        this.newComment = '';
        this.showCommentForm = false;
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    editBook(): void {
      const bookId = this.$route.params.id;
      this.$router.push(`/editbook/${bookId}`);
    },
    async deleteBook() {
      const bookId = this.$route.params.id;
      try {
        const response = await fetch(`http://192.168.1.51:8000/api/books/${bookId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        this.$router.push('/bookslist');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  },
  async created() {
    await this.fetchBook();
    await this.fetchComments();
  },
});
</script>

<style scoped>
@import '@/assets/css/books.css';
</style>
