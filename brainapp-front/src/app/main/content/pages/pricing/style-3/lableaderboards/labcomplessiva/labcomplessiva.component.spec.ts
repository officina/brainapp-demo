import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabcomplessivaComponent } from './labcomplessiva.component';

describe('LabcomplessivaComponent', () => {
  let component: LabcomplessivaComponent;
  let fixture: ComponentFixture<LabcomplessivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabcomplessivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabcomplessivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
