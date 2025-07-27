import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/Base/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },

  {
    path: 'login',
    loadComponent: () => import('./modules/Auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [nonAuthGuard],
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/Auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [nonAuthGuard],
    title: 'Register'
  },

  {
    path: 'explore',
    loadComponent: () => import('./modules/Base/explore/explore.component').then(m => m.ExploreComponent),
    title: 'Explore Articles'
  },

  {
    path: 'articles',
    loadComponent: () => import('./modules/Article/my-articles/my-articles.component').then(m => m.MyArticlesComponent),
    canActivate: [authGuard],
    title: 'My Articles'
  },
  {
    path: 'articles/create',
    loadComponent: () => import('./modules/Article/article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [authGuard],
    title: 'Create Article'
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./modules/Article/article-read/article-read.component').then(m => m.ArticleReadComponent),
    title: 'Read Article'
  },
  {
    path: 'articles/slug/:slug',
    loadComponent: () => import('./modules/Article/article-read/article-read.component').then(m => m.ArticleReadComponent),
    title: 'Read Article'
  },

  {
    path: '**',
    redirectTo: ''
  }
];
