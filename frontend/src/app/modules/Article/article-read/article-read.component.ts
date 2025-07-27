import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article/article.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IArticle } from '../../../core/interfaces/article.interface';
import { formatDate } from '../../../utils/helpers.utils';


@Component({
  selector: 'app-article-read',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-read.component.html',
  styleUrls: ['./article-read.component.css']
})
export class ArticleReadComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly authService = inject(AuthService);

  article = signal<IArticle | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isAuthor = signal<boolean>(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      const slug = params['slug'];
      
      if (articleId || slug) {
        this.loadArticle(articleId || slug);
      }
    });
  }

  private async loadArticle(identifier: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await this.articleService.getArticleById(identifier).toPromise();
      
      if (response && response.success) {        
        this.article.set(response.data);
        this.checkIfAuthor(response.data);
      } else {
        this.error.set('Article not found');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load article');
    } finally {
      this.loading.set(false);
    }
  }

  private checkIfAuthor(article: IArticle): void {
    const currentUser = this.authService.getCurrentUser();
    this.isAuthor.set(currentUser?.id === article.authorId);
  }

  onEditArticle(): void {
    if (this.article() && this.isAuthor()) {
      this.router.navigate(['/dashboard/articles/edit', this.article()!.id]);
    }
  }

  goBack(): void {
    window.history.back();
  }

  shareArticle(): void {
    if (navigator.share && this.article()) {
      navigator.share({
        title: this.article()!.title,
        text: this.article()!.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  formatDate(date: string): string {
    return formatDate(date)
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  // getReadTime(): number {
  //   if (!this.article()?.content) return 0;
    
  //   const plainText = this.article()!.content.replace(/<[^>]*>/g, '');
  //   const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  //   const wordsPerMinute = 200;
  //   return Math.max(1, Math.ceil(words.length / wordsPerMinute));
  // }

  // getWordCount(): number {
  //   if (!this.article()?.content) return 0;
    
  //   const plainText = this.article()!.content.replace(/<[^>]*>/g, '');
  //   const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  //   return words.length;
  // }
}
