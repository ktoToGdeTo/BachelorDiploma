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
  
  @Output() change = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();
  @Output() confirm = new EventEmitter<Task>();

  authService = inject(AuthService);

  onOverlayClick(event: MouseEvent): void {
    // Закрываем только при клике на сам overlay, а не на окно
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onConfirm(): void {
    this.confirm.emit(this.task);
  }

  onChange(): void{
    this.change.emit(this.task.id!);
  }

  onDelete(): void{
    this.delete.emit(this.task.id!);
  }


  get previousTask(): Task | null {
    if (!this.chain?.tasksChain || !this.task?.id) return null;
    
    // Просто ищем индекс текущей задачи в уже отсортированном массиве
    const currentIndex = this.chain.tasksChain.findIndex(t => t.id === this.task.id);
    
    // Если индекс больше 0, значит это не первая задача, и мы можем взять предыдущую
    if (currentIndex > 0) {
      return this.chain.tasksChain[currentIndex - 1];
    }
    
    return null; // Если это первая задача, предыдущей нет
  }

  /**
   * Проверяет, заблокирована ли текущая задача из-за предыдущей
   */
  get isBlockedByPreviousTask(): boolean {
    // Задача заблокирована, если есть предыдущая и она НЕ в статусе DONE
    return this.previousTask !== null && this.previousTask!.status !== 'DONE';
  }
}
