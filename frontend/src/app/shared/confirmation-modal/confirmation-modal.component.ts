import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Delete Article';
  @Input() message = 'Are you sure you want to delete this article? This action cannot be undone and will permanently remove the article from your collection.';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
