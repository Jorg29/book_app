<template>
  <div>
    <div v-if="showVideo" class="video-container">
      <video
        ref="introVideo"
        class="intro-video"
        @ended="onVideoEnded"
        autoplay
        muted
        playsinline
      >
        <source :src="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button class="skip-button" @click="skipVideo">Skip</button>
    </div>
    <div v-else class="blur-background">
      <div class="book-container">
        <div class="book-cover">
          <div class="outlined-container">
            <div class="cover-elements">
              <h2 class="cover-title">The Bookstore</h2>
              <h3 class="cover-subtitle">Find Your Next Read</h3>
              <hr class="cover-divider">
            </div>
            <div class="welcome-container">
              <div class="image-container">
                <img src="https://c4.wallpaperflare.com/wallpaper/662/990/531/fantasy-book-hd-wallpaper-preview.jpg" alt="Bookstore Image" class="welcome-image">
              </div>
              <h1>Welcome to Our Bookstore!</h1>
              <p>
                Explore our collection of books, manage and find your next
                favorite read.
              </p>
              <router-link to="/register" class="btn btn-primary">Register</router-link>
              <router-link to="/login" class="btn btn-secondary">Login</router-link>
              <div class="image-gallery">
                <img src="@/assets/images/book1.png" alt="Book 1" class="gallery-image">
                <img src="@/assets/images/book2.png" alt="Book 2" class="gallery-image">
                <img src="@/assets/images/book3.png" alt="Book 3" class="gallery-image">
              </div>
            </div>
          </div>
          <div class="spine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import videoSrc from '@/assets/video/video.mp4';
import { defineComponent } from 'vue';


export default defineComponent({
  data() {
    return {
      showVideo: true,
      videoSrc: videoSrc
    };
  },
  methods: {
    onVideoEnded() {
      this.showVideo = false;
    },
    skipVideo() {
      this.showVideo = false;
      (this.$refs.introVideo as HTMLVideoElement).pause();
    }
  }
});
</script>


<style scoped>
@import '@/assets/css/welcome.css';
</style>