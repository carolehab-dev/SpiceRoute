import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOnlyComponent } from './display-only.component';

describe('DisplayOnlyComponent', () => {
  let component: DisplayOnlyComponent;
  let fixture: ComponentFixture<DisplayOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayOnlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
