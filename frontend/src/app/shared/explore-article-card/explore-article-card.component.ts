import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IArticle } from '../../core/interfaces/article.interface';
import { Router } from '@angular/router';
import { formatDate } from '../../utils/helpers.utils';

@Component({
  selector: 'app-explore-article-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore-article-card.component.html',
  styleUrl: './explore-article-card.component.css'
})
export class ExploreArticleCardComponent {
  @Input({ required: true }) article!: IArticle;
  private readonly router = inject(Router);

  formatDate(dateString: string): string {
    return formatDate(dateString)
  }

  navigateToArticle(): void {
    if (this.article.id) {
      this.router.navigate(['/articles', this.article.id]);
    }
  }
}
