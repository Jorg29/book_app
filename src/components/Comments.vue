<template>
  <div class="wrapper">
    <div class="logo">
      <img src="https://t4.ftcdn.net/jpg/04/92/24/55/360_F_492245515_B06u4GqjtSox45R7iDOCLIamWIJipzFT.jpg" alt="">
    </div>
    <div class="text-center mt-4 name">
      The Bookstore
    </div>
    <div class="comments-section mt-4">
      <h2>Comments</h2>
    </div>
    <form @submit.prevent="addComment" class="p-3 mt-3">
      <div class="form-field d-flex align-items-center">
        <span class="far fa-user"></span>
        <textarea v-model="newComment" class="form-control smaller-input" rows="3" placeholder="Add a comment..." required></textarea>
      </div>
      <button type="submit" class="btn mt-3 btn-primary btn-block">Post Comment</button>
    </form>
    <button class="btn back-button" @click="goBack">
      <span class="fas fa-arrow-left"></span> Back to Book
    </button>
  </div>
</template>

<script lang="ts">
import axiosInstance from '@/axios-auth';
import { AxiosError } from 'axios';
import { defineComponent } from 'vue';

interface Comment {
  id: number;
  content: string;
  author: string;
}

export default defineComponent({
  data() {
    return {
      newComment: '',
      comments: [] as Comment[]
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      const bookId = this.$route.params.id as string;
      try {
        const response = await axiosInstance.get(`/books/${bookId}/comments/`);
        this.comments = response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error('Error fetching comments:', error.response.data);
        } else {
          console.error('Error fetching comments:', error);
        }
      }
    },
    async addComment() {
      if (this.newComment.trim() !== '') {
        try {
          const bookId = this.$route.params.id as string;
          const response = await axiosInstance.post(`/books/${bookId}/comments/`, {
            text: this.newComment
          });
          this.comments.push(response.data);
          this.newComment = '';
          this.$router.push(`/book/${bookId}`);
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            console.error('Error adding comment:', error.response.data);
          } else {
            console.error('Error adding comment:', error);
          }
        }
      }
    },
    async deleteComment(commentId: number) {
      try {
        await axiosInstance.delete(`/comments/${commentId}/`);
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error('Error deleting comment:', error.response.data);
        } else {
          console.error('Error deleting comment:', error);
        }
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
});
</script>

<style scoped>
@import '@/assets/css/comments.css';
</style>
