import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPieceComponent } from './next-piece.component';

describe('NextPieceComponent', () => {
  let component: NextPieceComponent;
  let fixture: ComponentFixture<NextPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextPieceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
