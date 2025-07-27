import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize, debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { NavComponent } from '../../../shared/nav/nav.component';
import { ToastrService } from 'ngx-toastr';
import { ArticleResponse, ErrorResponse, IArticle, ICreateArticle, IUpdateArticle } from '../../../core/interfaces/article.interface';
import { ArticleCardComponent } from '../../../shared/article-card/article-card.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ArticleService } from '../../../core/services/article/article.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from "../../../shared/confirmation-modal/confirmation-modal.component"; 

@Component({
  selector: 'app-my-articles',
  standalone: true,
  imports: [CommonModule, NavComponent, ArticleCardComponent, ArticleFormComponent, FormsModule, ConfirmationModalComponent], 
  templateUrl: './my-articles.component.html',
  styleUrl: './my-articles.component.css'
})
export class MyArticlesComponent implements OnInit, OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private readonly articleService = inject(ArticleService);
  private readonly toastr = inject(ToastrService);

  articles: IArticle[] = [];
  filteredArticles: IArticle[] = [];
  isLoading = false;
  isFormLoading = false;
  showForm = false;
  selectedArticle: IArticle | null = null;
  showDeleteModal = false;
  articleToDelete: string | null = null;
  searchTerm: string = '';

  get totalArticles(): number {
    return this.articles.length;
  }

  ngOnInit(): void {
    this.loadArticles();
    this.subscribeToArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToArticles(): void {
    this.articleService.articles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(articles => {
        this.articles = articles;
        this.filterArticles(); 
      });
  }

  private loadArticles(): void {
    this.isLoading = true;
    this.articleService.getUserArticles()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.toastr.error(response.message || 'Failed to load articles');
          }
        },
        error: () => {
          this.toastr.error('Failed to load articles');
        }
      });
  }
  
  onSearchChange(): void {
    this.filterArticles();
  }

  private filterArticles(): void {
    if (!this.searchTerm) {
      this.filteredArticles = [...this.articles];
    } else {
      const lowerCaseTerm = this.searchTerm.toLowerCase();
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(lowerCaseTerm) ||
        article.excerpt.toLowerCase().includes(lowerCaseTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerCaseTerm))
      );
    }
  }

  onCreateNew(): void {
    this.selectedArticle = null;
    this.showForm = true;
  }

  onEditArticle(article: IArticle): void {
    this.selectedArticle = article;
    this.showForm = true;
  }

  onDeleteArticle(articleId: string): void {
    this.articleToDelete = articleId;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.articleToDelete) {
      this.deleteArticle(this.articleToDelete);
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.articleToDelete = null;
  }

  private deleteArticle(articleId: string): void {
    this.articleService.deleteArticle(articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Article deleted successfully');
          } else {
            this.toastr.error(response.message || 'Failed to delete article');
          }
        },
        error: () => {
          this.toastr.error('Failed to delete article');
        }
      });
  }

  onSaveArticle(articleData: ICreateArticle | IUpdateArticle): void {
  this.isFormLoading = true;
  
  let operation: Observable<ArticleResponse | ErrorResponse>;
  
  if (this.selectedArticle) {
    const updateData: IUpdateArticle = {
      id: this.selectedArticle.id,
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      tags: articleData.tags
    };
    operation = this.articleService.updateArticle(updateData);
  } else {
    operation = this.articleService.createArticle(articleData as ICreateArticle);
  }

  operation
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isFormLoading = false)
    )
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(
            this.selectedArticle ? 'Article updated successfully' : 'Article created successfully'
          );
          this.closeForm();
        } else {
          this.toastr.error(response.message || 'Operation failed');
        }
      },
      error: (error) => {
        console.error('Save operation failed:', error);
        this.toastr.error('Operation failed');
      }
    });
}



  onCancelForm(): void {
    this.closeForm();
  }

  private closeForm(): void {
    this.showForm = false;
    this.selectedArticle = null;
  }
}
