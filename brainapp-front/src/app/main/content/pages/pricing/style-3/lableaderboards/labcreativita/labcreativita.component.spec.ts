import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabcreativitaComponent } from './labcreativita.component';

describe('LabcreativitaComponent', () => {
  let component: LabcreativitaComponent;
  let fixture: ComponentFixture<LabcreativitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabcreativitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabcreativitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
