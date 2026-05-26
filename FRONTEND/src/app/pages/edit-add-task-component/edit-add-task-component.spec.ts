import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddTaskComponent } from './edit-add-task-component';

describe('EditAddTaskComponent', () => {
  let component: EditAddTaskComponent;
  let fixture: ComponentFixture<EditAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAddTaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
