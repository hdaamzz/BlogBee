import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExploreArticleCardComponent } from '../../../shared/explore-article-card/explore-article-card.component';
import { NavComponent } from '../../../shared/nav/nav.component';
import { ArticleService } from '../../../core/services/article/article.service';
import { IArticle } from '../../../core/interfaces/article.interface';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavComponent, FormsModule, ExploreArticleCardComponent], 
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly articleService = inject(ArticleService);
  private readonly router = inject(Router);

  articles: IArticle[] = [];
  filteredArticles: IArticle[] = [];
  isLoading = false;
  searchTerm: string = '';
  selectedTag: string = '';
  currentPage = 1;
  articlesPerPage = 9;
  totalPages = 1;

  availableTags: string[] = [];

  get paginatedArticles(): IArticle[] {
    const startIndex = (this.currentPage - 1) * this.articlesPerPage;
    const endIndex = startIndex + this.articlesPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }

  get totalArticles(): number {
    return this.filteredArticles.length;
  }

  ngOnInit(): void {
    this.loadAllArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllArticles(): void {
    this.isLoading = true;
    this.articleService.getAllArticles(1, 100)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.articles = response.data.articles;
            this.filteredArticles = [...this.articles];
            this.extractTags();
            this.updatePagination();
          }
        },
        error: (error) => {
          console.error('Failed to load articles:', error);
        }
      });
  }

  private extractTags(): void {
    const tagSet = new Set<string>();
    this.articles.forEach(article => {
      article.tags?.forEach(tag => tagSet.add(tag));
    });
    this.availableTags = Array.from(tagSet).sort();
  }

  onSearchChange(): void {
    this.filterArticles();
  }

  onTagSelect(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.filterArticles();
  }

  private filterArticles(): void {
    let filtered = [...this.articles];

    if (this.searchTerm) {
      const lowerCaseTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(lowerCaseTerm) ||
        article.excerpt.toLowerCase().includes(lowerCaseTerm) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowerCaseTerm))
      );
    }

    if (this.selectedTag) {
      filtered = filtered.filter(article =>
        article.tags?.includes(this.selectedTag)
      );
    }

    this.filteredArticles = filtered;
    this.currentPage = 1; 
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTag = '';
    this.filteredArticles = [...this.articles];
    this.currentPage = 1;
    this.updatePagination();
  }
}
