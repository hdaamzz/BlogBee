import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { IArticle, ICreateArticle, IUpdateArticle } from '../../../core/interfaces/article.interface';
import { ArticleService } from '../../../core/services/article/article.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  @Input() article: IArticle | null = null;
  @Input() isLoading = false;
  @Output() save = new EventEmitter<ICreateArticle | IUpdateArticle>();
  @Output() cancel = new EventEmitter<void>();
  private readonly articleService = inject(ArticleService);

  articleForm!: FormGroup;
  isEditing = false;
  isLoadingArticle = false; 
  private readonly formBuilder = inject(FormBuilder);

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    placeholder: 'Start writing your amazing article content here...',
    theme: 'snow'
  };

  async ngOnInit(): Promise<void> {
    this.isEditing = !!this.article;
    
    if (this.article?.id) {
      await this.setCompleteForm(this.article.id);
    }
    
    this.initializeForm();
  }

  async setCompleteForm(id: string): Promise<void> {
    try {
      this.isLoadingArticle = true;
      const response = await this.articleService.getArticleById(id).toPromise();
      
      if (response?.success) {
        this.article = response.data;
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      this.isLoadingArticle = false;
    }
  }

  private initializeForm(): void {
    this.articleForm = this.formBuilder.group({
      title: [this.article?.title || '', [Validators.required, Validators.minLength(5)]],
      excerpt: [this.article?.excerpt || '', [Validators.required, Validators.minLength(20)]],
      content: [this.article?.content || '', [Validators.required, Validators.minLength(50)]],
      tags: [this.article?.tags?.join(', ') || '']
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.articleForm.get(controlName);
    return !!(control?.hasError(errorName) && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    const formValue = this.articleForm.value;
    const articleData = {
      title: formValue.title,
      excerpt: formValue.excerpt,
      content: formValue.content,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []
    };

    if (this.isEditing && this.article?.id) {
      const updateData: IUpdateArticle = {
        id: this.article.id,
        ...articleData
      };
      this.save.emit(updateData);
    } else {
      this.save.emit(articleData as ICreateArticle);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
