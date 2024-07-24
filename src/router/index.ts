import AddBook from '@/components/AddBook.vue';
import BookDetail from '@/components/BookDetail.vue';
import Books from '@/components/Books.vue';
import BooksList from '@/components/BooksList.vue';
import Comments from '@/components/Comments.vue';
import DeleteBook from '@/components/DeleteBook.vue';
import EditBook from '@/components/EditBook.vue';
import ForgetPassword from '@/components/ForgetPassword.vue';
import Login from '@/components/Login.vue';
import NewPassword from '@/components/NewPassword.vue';
import Register from '@/components/Register.vue';
import Welcome from '@/components/Welcome.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/bookslist', component: BooksList },
  { path: '/addbook', component: AddBook },
  { path: '/deletebook/:id', component: DeleteBook },
  { path: '/editbook/:id', component: EditBook },
  { path: '/books', component: Books },
  { path: '/comments/:id', component: Comments },
  { path: '/book/:id', component: BookDetail },
  { path: '/', component: Welcome },
  { path: '/password-reset/', component: ForgetPassword },
  { path: '/password-reset-confirm/', component: NewPassword}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
