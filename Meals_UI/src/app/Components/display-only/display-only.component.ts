import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meal } from '../../Models/meal';

interface Recipe {
  id: number;       //for api call
  name: string;
  image: string;
  description: string;
  instructions: string;
  facts: string;
  cuisine: string;
  cook_time: string;
  ingredients: Ingredient[];
}

interface Ingredient {
  name: string;
  amount: string;
  category:string;
}

@Component({
  selector: 'app-display-only',
  imports: [FormsModule,CommonModule],
  templateUrl: './display-only.component.html',
  styleUrl: './display-only.component.css'
})
export class DisplayOnlyComponent {
  editMode = false;    //to lock the form until i press update
  recipe?: Recipe;    //as it is not initialized


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit():void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Recipe>(`http://localhost:5142/api/ProfileRecipes/displayOnlyRecipe/${id}`).subscribe({
        next: (data) => {
          this.recipe = data;}
      });
    }
  }

}
