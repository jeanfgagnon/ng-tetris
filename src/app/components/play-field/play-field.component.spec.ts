import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayFieldComponent } from './play-field.component';

describe('PlayFieldComponent', () => {
  let component: PlayFieldComponent;
  let fixture: ComponentFixture<PlayFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
