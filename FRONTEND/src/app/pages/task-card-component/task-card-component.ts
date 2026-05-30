import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task } from '../../core/entity/task';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-task-card-component',
  imports: [CommonModule],
  templateUrl: './task-card-component.html',
  styleUrl: './task-card-component.css',
})
export class TaskCardComponent {  
  @Input({ required: true }) task!: Task;
  @Output() deleteTask = new EventEmitter<number>();
  @Output() changeTask = new EventEmitter<number>();

  authService = inject(AuthService);

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  onChange(): void {
    this.changeTask.emit(this.task.id);
  }
}
