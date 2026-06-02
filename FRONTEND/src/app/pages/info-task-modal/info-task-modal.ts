import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task } from '../../core/entity/task';
import { AuthService } from '../../core/services/auth-service';
import { ChainTasks } from '../../core/entity/chainTasks';

@Component({
  selector: 'app-info-task-modal',
  imports: [CommonModule],
  templateUrl: './info-task-modal.html',
  styleUrl: './info-task-modal.css',
})
export class InfoTaskModal {
  @Input({ required: true }) task!: Task;
  @Input() chain: ChainTasks | null = null;      // <-- НОВОЕ
  @Input() canConfirm = true;                   // <-- НОВОЕ
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  authService = inject(AuthService);

  onOverlayClick(event: MouseEvent): void {
    // Закрываем только при клике на сам overlay, а не на окно
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onConfirm(): void {
    this.confirm.emit(this.task.id!);
  }
}
