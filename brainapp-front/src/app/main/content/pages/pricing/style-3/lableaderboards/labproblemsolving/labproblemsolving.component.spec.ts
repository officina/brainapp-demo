import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabproblemsolvingComponent } from './labproblemsolving.component';

describe('LabproblemsolvingComponent', () => {
  let component: LabproblemsolvingComponent;
  let fixture: ComponentFixture<LabproblemsolvingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabproblemsolvingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabproblemsolvingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
