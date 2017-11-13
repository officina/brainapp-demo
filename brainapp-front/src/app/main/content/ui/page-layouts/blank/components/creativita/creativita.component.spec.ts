import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativitaComponent } from './creativita.component';

describe('CreativitaComponent', () => {
  let component: CreativitaComponent;
  let fixture: ComponentFixture<CreativitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
