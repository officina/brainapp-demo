import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsolvingComponent } from './problemsolving.component';

describe('ProblemsolvingComponent', () => {
  let component: ProblemsolvingComponent;
  let fixture: ComponentFixture<ProblemsolvingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsolvingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsolvingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
