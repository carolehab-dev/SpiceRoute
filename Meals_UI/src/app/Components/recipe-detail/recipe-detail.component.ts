import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeApiService } from '../../Services/home-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule,FormsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  newRating = 0;
  newComment = '';
  user: any = null;
  error = '';

  constructor(private route: ActivatedRoute, private api: HomeApiService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadRecipe(id);

    this.api.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  loadRecipe(id: number) {
    this.api.getRecipeById(id).subscribe({
      next: recipe => this.recipe = recipe,
      error: () => this.error = 'Failed to load recipe details'
    });
  }

  submitReview() {
    if (!this.user) {
      alert('Please login to add a review.');
      return;
    }

    if (!this.newComment.trim() || this.newRating === 0) {
      alert('Please enter a comment and select a rating.');
      return;
    }

    const review = {
      comment: this.newComment,
      rating: this.newRating,
      userId: this.user.id
    };

    this.api.addReview(this.recipe.id, review).subscribe({
      next: () => {
        this.newComment = '';
        this.newRating = 0;
        this.loadRecipe(this.recipe.id);
      },
      error: () => alert('Failed to add review')
    });
  }

}
