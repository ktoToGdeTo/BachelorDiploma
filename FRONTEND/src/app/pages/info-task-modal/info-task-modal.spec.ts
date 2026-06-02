import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTaskModal } from './info-task-modal';

describe('InfoTaskModal', () => {
  let component: InfoTaskModal;
  let fixture: ComponentFixture<InfoTaskModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTaskModal],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoTaskModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
