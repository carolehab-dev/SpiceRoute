import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeApiService } from '../../Services/home-api.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  recipes: any[] = [];
  cuisine = '';
  maxTime: any = null;
  search = '';
  savedRecipeIds = new Set<number>();
  user: any = null;

  constructor(private api: HomeApiService) {}

  ngOnInit() {
    this.api.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.api.getSavedRecipes(user.id).subscribe(
          (data: any) => {
            const savedRecipes = data as any[];
            this.savedRecipeIds = new Set(savedRecipes.map(r => r.id));
          },
          (err) => {
            console.error('Failed to load saved recipes');
          }
        );
      } else {
        this.savedRecipeIds.clear();
      }
    });

    this.loadRecipes();
  }

  loadRecipes() {
    const filters: any = {};
    if (this.cuisine) filters.cuisine = this.cuisine;
    if (this.maxTime) filters.maxTime = this.maxTime;
    if (this.search) filters.search = this.search;

    this.api.getRecipes(filters).subscribe(
      (data: any) => {
        this.recipes = data as any[];
      },
      (err) => {
        console.error('Failed to load recipes');
      }
    );
  }

  onFilterChange() {
    this.loadRecipes();
  }

  toggleSaveRecipe(recipeId: number) {
    if (!this.user) {
      alert('Please login to save recipes.');
      return;
    }

    if (this.savedRecipeIds.has(recipeId)) {
      this.api.unsaveRecipe(this.user.id, recipeId).subscribe({
        next: () => this.savedRecipeIds.delete(recipeId),
        error: () => alert('Failed to unsave recipe')
      });
    } else {
      this.api.saveRecipe(this.user.id, recipeId).subscribe({
        next: () => this.savedRecipeIds.add(recipeId),
        error: () => alert('Failed to save recipe')
      });
    }
  }

}
