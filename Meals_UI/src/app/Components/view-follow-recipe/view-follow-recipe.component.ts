import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeApiService } from '../../Services/home-api.service';
@Component({
  selector: 'app-view-follow-recipe',
  imports: [CommonModule],
  templateUrl: './view-follow-recipe.component.html',
  styleUrl: './view-follow-recipe.component.css'
})
export class ViewFollowRecipeComponent implements OnInit{

  // userId!: number;
  currentUserId: number = 0; // get this from login/session
  recipes: any[] = [];
  showNotFollowingMessage: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private service: HomeApiService) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserId = user.id;
    }
   }

  ngOnInit(): void {

    const userId = +this.route.snapshot.paramMap.get('userId')!;

    if(userId)
    {


      this.http.get<any[]>(`http://localhost:5142/api/ProfileRecipes/recipesOfUser/${userId}/viewer/${this.currentUserId}`)
      .subscribe({
        next: (data) => {
          this.recipes = data;
        },
        error: (error) => {
            if (error.status === 500) {
              this.showNotFollowingMessage = true;
            }
          }
      });
    }
  }

  viewDetails(Id: number): void {
    this.router.navigate(['displayonlyRecipe', Id]);
  }

}
