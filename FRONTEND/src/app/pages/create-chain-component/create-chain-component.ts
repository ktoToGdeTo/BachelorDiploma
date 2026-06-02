import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChainTasks } from '../../core/entity/chainTasks';
import { User } from '../../core/entity/user';
import { AuthService } from '../../core/services/auth-service';
import { TaskService } from '../../core/services/task-service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-chain-component',
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './create-chain-component.html',
  styleUrl: './create-chain-component.css',
})
export class CreateChainComponent {
 private fb = inject(FormBuilder);
 private route = inject(ActivatedRoute);
  router = inject(Router);
  chainId!: number;
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private cd = inject(ChangeDetectorRef);
  isCreateMode: boolean = true;

  // Основная форма
  chainForm: FormGroup;

  // Список пользователей для выпадающего списка (заглушка, замените на запрос к API)
  usersList: User[] = [];

  isSubmitting = false;

  constructor() {
    this.chainForm = this.fb.group({
      titleChain: ['', [Validators.required, Validators.minLength(3)]],
      deadlineTime: [''],
      tasksChain: this.fb.array([]) // Динамический массив задач
    });

    // Добавляем первую задачу по умолчанию при инициализации
    this.addTask();
  }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.usersList = data;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Ошибка при получении пользователей', err);
      }
    });

    this.chainId = Number(this.route.snapshot.paramMap.get('id'));
    const url = this.route.snapshot.url.join('/');
    this.isCreateMode = url.includes('create');
    if (!this.isCreateMode && this.chainId) {
      this.loadTaskData();
    }
  }

  loadTaskData(): void {
    this.taskService.getChain(this.chainId).subscribe({
      next: (chain: ChainTasks) => {
              this.chainForm.patchValue({
                titleChain: chain.titleChain,
                deadlineTime: chain.deadlineTime
              });

              this.tasksArray.clear();

              chain.tasksChain.forEach(task => {
            const group = this.createTaskGroup();
            group.patchValue(task); // Заполняем title, description, created_by и id
            this.tasksArray.push(group);
      });
            }
    })
  }

  // Геттер для удобного доступа к FormArray в шаблоне
  get tasksArray(): FormArray {
    return this.chainForm.get('tasksChain') as FormArray;
  }

  // Создание новой группы полей для одной задачи
  private createTaskGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      created_by: ['', Validators.required]
    });
  }

  // Добавить новую форму задачи
  addTask(): void {
    this.tasksArray.push(this.createTaskGroup());
  }

  // Удалить форму задачи по индексу
  removeTask(index: number): void {
    if (this.tasksArray.length > 1) {
      this.tasksArray.removeAt(index);
    } else {
      alert('В цепочке должна быть хотя бы одна задача.');
    }
  }

  // Отправка формы
  onSubmit(): void {
    if (this.chainForm.invalid) {
      this.chainForm.markAllAsTouched(); // Показать ошибки валидации
      return;
    }

    this.isSubmitting = true;
    const payload: ChainTasks = this.chainForm.value;
 const request$ = this.isCreateMode
    ? this.taskService.createChain(payload)
    : this.taskService.updateChain(this.chainId, payload); // Нужен новый метод в сервисе!

    request$.subscribe({
      next: () => {
        this.router.navigate(['/tasks']); // Перенаправление на список задач
      },
      error: (err) => {
        console.error('Ошибка создания цепочки:', err);
        this.isSubmitting = false;
      }
    });
  }

  // Хелпер для проверки ошибок в конкретной задаче
  hasError(control: AbstractControl, field: string, errorType: string): boolean {
    // Безопасно приводим к FormGroup, так как мы знаем, что передаем туда группу полей задачи
    const formGroup = control as FormGroup;
    const targetControl = formGroup.get(field);
    
    return !!targetControl && targetControl.hasError(errorType) && targetControl.touched;
  }

/**
 * Обработчик события завершения перетаскивания
 */
drop(event: CdkDragDrop<any[]>) {
  // Если элемент перетащили на то же место, ничего не делаем
  if (event.previousIndex === event.currentIndex) {
    return;
  }

  // 1. Получаем контрол (FormGroup) задачи, которую перемещаем
  const control = this.tasksArray.at(event.previousIndex);

  // 2. Удаляем его со старой позиции
  this.tasksArray.removeAt(event.previousIndex);

  // 3. Вставляем его на новую позицию
  // Это корректно обновляет внутреннее состояние FormArray, сохраняя валидацию и значения
  this.tasksArray.insert(event.currentIndex, control);
  
  // 4. (Опционально) Помечаем форму как измененную, если это важно для вашей логики
  this.chainForm.markAsDirty();
}

}
