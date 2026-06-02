import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChainComponent } from './create-chain-component';

describe('CreateChainComponent', () => {
  let component: CreateChainComponent;
  let fixture: ComponentFixture<CreateChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChainComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
