import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFollowRecipeComponent } from './view-follow-recipe.component';

describe('ViewFollowRecipeComponent', () => {
  let component: ViewFollowRecipeComponent;
  let fixture: ComponentFixture<ViewFollowRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFollowRecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFollowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
