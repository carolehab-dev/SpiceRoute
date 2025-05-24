import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeApiService } from '../../Services/home-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-saved-recipes',
  imports: [CommonModule,RouterLink],
  templateUrl: './saved-recipes.component.html',
  styleUrl: './saved-recipes.component.css'
})
export class SavedRecipesComponent implements OnInit{
  savedRecipes: any[] = [];
  user: any = null;
  loading = false;
  error = '';

  constructor(private api: HomeApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.api.getSavedRecipes(user.id).subscribe({
          next: (recipes: any) => {
            this.savedRecipes = recipes;
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load saved recipes.';
            this.loading = false;
            this.savedRecipes = [];
          }
        });
      } else {
        this.savedRecipes = [];
        this.loading = false;
      }
    });
  }

  unsave(recipeId: number) {
    if (!this.user) return;

    this.api.unsaveRecipe(this.user.id, recipeId).subscribe({
      next: () => {
        this.savedRecipes = this.savedRecipes.filter(r => r.id !== recipeId);
      },
      error: () => alert('Failed to remove saved recipe')
    });
  }

}
