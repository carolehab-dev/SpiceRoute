import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Recipe {
  id: number;       //for api call
  name: string;
  image: string;
  description: string;
  instructions: string;
  facts: string;
  cuisine: string;
  cook_time: number;
  ingredients: Ingredient[];
}

interface Ingredient {
  name: string;
  amount: string;
  category:string;
}

@Component({
  selector: 'app-one-recipe',
  imports: [CommonModule, FormsModule],
  templateUrl: './one-recipe.component.html',
  styleUrl: './one-recipe.component.css'
})
export class OneRecipeComponent implements OnInit {
  editMode = false;    //to lock the form until i press update
  recipe?: Recipe;    //as it is not initialized
  currentID: number = 0;


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentID = user.id;
    }
  }

  ngOnInit(): void {
    // const id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.http.get<Recipe>(`http://localhost:5142/api/ProfileRecipes/oneRecipe/${id}/user/${this.currentID}`).subscribe({
          next: (data) => {
            this.recipe = data;
          }
        });
      }
    });

  }



    addIngredient() {
      if (this.recipe) {
        this.recipe.ingredients.push({
          name: '',
          amount: '',
          category: ''
        });
      }
    }

    removeIngredient(index: number) {
      if (this.recipe) {
        this.recipe.ingredients.splice(index, 1);
      }
    }

    saveRecipe() {

      //to make validation
      if (this.recipe && this.recipe.name.trim() && this.recipe.description.trim() &&
        this.recipe.instructions.trim() && this.recipe.cuisine.trim() &&
        this.recipe.facts.trim() &&
        this.recipe.ingredients.every(ing => ing.name.trim() && ing.amount.trim() && ing.category.trim())) {

        this.http.put(`http://localhost:5142/api/ProfileRecipes/${this.recipe.id}/user/${this.currentID}`, this.recipe).subscribe({
          next: () => {
            this.editMode = false;
            alert('Recipe updated successfully!');
          }
        });
      } else {
        alert('Please fill in all required fields.');
      }
    }

    deleteRecipe() {

      if (this.recipe) {
        const confirmDelete = confirm('Are you sure you want to delete this recipe?');
        if (confirmDelete) {
          this.http.delete(`http://localhost:5142/api/ProfileRecipes/${this.recipe.id}`).subscribe({
            next: () => {
              // alert('Recipe deleted successfully!');
              this.router.navigate(['home']);
            }
          });
        }
      }
    }
  }

