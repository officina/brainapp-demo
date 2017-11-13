import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplessivaComponent } from './complessiva.component';

describe('ComplessivaComponent', () => {
  let component: ComplessivaComponent;
  let fixture: ComponentFixture<ComplessivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplessivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplessivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
