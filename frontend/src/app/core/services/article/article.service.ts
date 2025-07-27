import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AllarticlesResponse, ArticleResponse, ArticlesResponse, DeleteResponse, ErrorResponse, IArticle, ICreateArticle, IUpdateArticle } from '../../interfaces/article.interface';
import { env } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${env.apiUrl}/articles`;

  private articlesSubject = new BehaviorSubject<IArticle[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();


  getUserArticles(): Observable<ArticlesResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ArticlesResponse>(`${this.baseUrl}/user`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success) {
          this.articlesSubject.next(response.data);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to fetch articles';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  createArticle(article: ICreateArticle): Observable<ArticleResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<ArticleResponse>(`${this.baseUrl}`, article, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success) {
          const currentArticles = this.articlesSubject.value;
          this.articlesSubject.next([response.data, ...currentArticles]);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to create article';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  updateArticle(article: IUpdateArticle): Observable<ArticleResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();
    const { id, ...articleData } = article;
    return this.http.put<ArticleResponse>(`${this.baseUrl}/${id}`, articleData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success) {
          const currentArticles = this.articlesSubject.value;
          const updatedArticles = currentArticles.map(a => 
            a.id === article.id ? response.data : a
          );
          this.articlesSubject.next(updatedArticles);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to update article';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  deleteArticle(id: string): Observable<DeleteResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<DeleteResponse>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success) {
          const currentArticles = this.articlesSubject.value;
          const filteredArticles = currentArticles.filter(a => a.id !== id);
          this.articlesSubject.next(filteredArticles);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to delete article';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  getArticleById(id: string): Observable<ArticleResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ArticleResponse>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to fetch article';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  getAllArticles(page: number = 1, limit: number = 10): Observable<AllarticlesResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<AllarticlesResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`).pipe(
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Failed to fetch articles';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }


  searchArticles(query: string): Observable<ArticlesResponse | ErrorResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ArticlesResponse>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      tap(() => {
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        const errorMessage = error.error?.message || 'Search failed';
        this.setError(errorMessage);
        
        const fallback: ErrorResponse = {
          success: false,
          message: errorMessage
        };
        return of(fallback);
      })
    );
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }

  getCurrentArticles(): IArticle[] {
    return this.articlesSubject.value;
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  getCurrentError(): string | null {
    return this.errorSubject.value;
  }

  clearArticleData(): void {
    this.articlesSubject.next([]);
    this.clearError();
    this.setLoading(false);
  }

  refreshArticles(): Observable<ArticlesResponse | ErrorResponse> {
    return this.getUserArticles();
  }
}
