import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeApiService } from '../../Services/home-api.service';
import { Meal } from '../../Models/meal';
import { PlansService } from '../../Services/plans.service';

@Component({
  selector: 'app-discover',
  imports: [CommonModule, RouterModule, FormsModule,ReactiveFormsModule],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit {
  recipes: Meal[] = [];
  cuisine = '';
  maxTime: any = null;
  search = '';
  savedRecipeIds = new Set<number>();
  user: any = null;

  //Nour
  // mealObservable: Observable<Meal[]>;
  showPopup = false;
  selectedMeal: Meal | null = null;
  selectedDate: string = '';
  selectedCategory: string = '';
  currentUserId: number = 0; // get this from login/session
  constructor(private api: HomeApiService, private plansService:PlansService)
  { const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserId = user.id;
    }}

  ngOnInit() {
    this.api.currentUser$.subscribe(user => {
      this.user=user;
      if(user){
        this.loadSavedRecipes(user.id);
      } else{
        this.savedRecipeIds.clear();
      }
    });
    this.loadRecipes();
  }

  private loadSavedRecipes(userId:number):void{
    this.api.getSavedRecipes(userId).subscribe({
      next:(savedRecipes:Meal[])=> {
        this.savedRecipeIds = new Set(savedRecipes.map(r=>r.id));
      },
      error:(err) =>{
        console.error('Failed to load saved recipes', err);
      }
    });
  }
  loadRecipes():void{
    const filters: {cuisine?: string; maxTime?: number; search?: string}={};
    if (this.cuisine) filters.cuisine = this.cuisine;
    if (this.maxTime) filters.maxTime = this.maxTime;
    if (this.search) filters.search = this.search;

     this.api.getRecipes(filters).subscribe({
      next: (recipes: Meal[]) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error('Failed to load recipes', err);
      }
    });

  }

  /* ngOnInit() {
  //   this.api.currentUser$.subscribe(user => {
  //     this.user = user;
  //     if (user) {
  //       this.api.getSavedRecipes(user.id).subscribe(
  //         (data: any) => {
  //           const savedRecipes = data as any[];
  //           this.savedRecipeIds = new Set(savedRecipes.map(r => r.id));
  //         },
  //         (err) => {
  //           console.error('Failed to load saved recipes');
  //         }
  //       );
  //     } else {
  //       this.savedRecipeIds.clear();
  //     }
  //   });

  //   this.loadRecipes();
  // }*/

  /* loadRecipes() {
  //   const filters: any = {};
  //   if (this.cuisine) filters.cuisine = this.cuisine;
  //   if (this.maxTime) filters.maxTime = this.maxTime;
  //   if (this.search) filters.search = this.search;

  //   this.api.getRecipes(filters).subscribe(
  //     (data: any) => {
  //       this.recipes = data as any[];
  //     },
  //     (err) => {
  //       console.error('Failed to load recipes');
  //     }
  //   );
  // }*/

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
        next: () => this.savedRecipeIds.delete(recipeId)
        // error: () => alert('Failed to unsave recipe')
      });
    } else {
      this.api.saveRecipe(this.user.id, recipeId).subscribe({
        next: () => this.savedRecipeIds.add(recipeId),
         error: () => alert('Failed to save recipe')
      });
    }
  }
   openPopup(meal: Meal) {
    this.selectedMeal = meal;
    this.showPopup = true;
  }

  closeModal() {
    this.showPopup = false;
    this.selectedMeal = null;
    this.selectedDate = '';
    this.selectedCategory = '';
  }

  submitPlan() {

    if (!this.selectedMeal || !this.selectedDate || !this.selectedCategory)
      {
        alert('Please fill all fields!')
        return;
      }
  //  const userId=this.user.id;
    const userId=this.currentUserId;
    const planData = {
      userId: userId, // get current user_iD
      recipeId: this.selectedMeal.id,
      name: this.selectedMeal.name,
      date: new Date(this.selectedDate).toISOString(),
      category: this.selectedCategory
    };

    console.log('Submitting plan:', planData);
    this.plansService.addMealToPlan(planData).subscribe({
    next: () => {
      alert('Meal successfully added to plan!');
      this.closeModal();
    },
    error: (err) => {
      console.error('Error adding meal to plan:', err);
      alert('Failed to add meal to plan. Please try again.');
    }
  });
  }
}
