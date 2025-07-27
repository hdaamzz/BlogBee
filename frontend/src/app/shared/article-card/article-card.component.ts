import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, HostListener } from '@angular/core';
import { IArticle } from '../../core/interfaces/article.interface';
import { Router } from '@angular/router';
import { formatDate } from '../../utils/helpers.utils';

@Component({
  selector: 'app-article-card',
  imports: [CommonModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css'
})
export class ArticleCardComponent {
  @Input({ required: true }) article!: IArticle;
  @Output() edit = new EventEmitter<IArticle>();
  @Output() delete = new EventEmitter<string>();

  showMenu = false;
  private readonly router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuContainer = target.closest('.menu-container');
    const isMenuButton = target.closest('.menu-button');
    
    if (!menuContainer && !isMenuButton) {
      this.showMenu = false;
    }
  }

  onCardClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-container') && !target.closest('.menu-button')) {
      this.navigateToArticle();
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.showMenu = false;
    this.edit.emit(this.article);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.showMenu = false;
    this.delete.emit(this.article.id);
  }

  formatDate(dateString: string): string {
    return formatDate(dateString)
  }

  navigateToArticle(): void {
    if (this.article.slug) {
      this.router.navigate(['/articles', this.article.slug]);
    }
  }
}
