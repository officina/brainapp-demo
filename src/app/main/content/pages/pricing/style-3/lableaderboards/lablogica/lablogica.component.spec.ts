import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LablogicaComponent } from './lablogica.component';

describe('LablogicaComponent', () => {
  let component: LablogicaComponent;
  let fixture: ComponentFixture<LablogicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LablogicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LablogicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
