import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../core/services/task-service';
import { Task } from '../../core/entity/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-add-task-component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-add-task-component.html',
  styleUrl: './edit-add-task-component.css',
})

export class EditAddTaskComponent implements OnInit {
  taskId!: number;
  taskForm: FormGroup;
  isCreateMode: boolean = true;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private cd = inject(ChangeDetectorRef);

  statusOptions = [
    { value: 'OPEN', label: 'Открыто' },
    { value: 'IN_PROGRESS', label: 'В процессе' },
    { value: 'DONE', label: 'Завершено' },
    { value: 'CLOSED', label: 'Закрыто' }
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['OPEN', Validators.required],
      description: ['']
    })
  }
  
  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    const url = this.route.snapshot.url.join('/');
    this.isCreateMode = url.includes('new');
    if (!this.isCreateMode && this.taskId) {
      this.loadTaskData();
    }
  }

  loadTaskData(): void {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          status: task.status,
          description: task.description
        });
      },
      error: (error) => {
        console.error('Error loading task:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isCreateMode) {
        this.createTask();
      } else {
        this.updateTask();
      }
    }
    this.cd.markForCheck();
  }
  createTask() {
    const newTask: Task = {
      title: this.taskForm.value.title,
      status: this.taskForm.value.status,
      description: this.taskForm.value.description
    };

    this.taskService.createTask(newTask).subscribe({
      next: (response) => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        alert('Слишком много активных задач')
        console.error('Error creating task:', error);
      }
    });
  }
  updateTask() {
    const updatedTask: Task = {
      id: this.taskId,
      title: this.taskForm.value.title,
      status: this.taskForm.value.status,
      description: this.taskForm.value.description
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (response) => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        alert('Слишком много активных задач')
        console.error('Error updating task:', error);
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/tasks']);
  }


}