import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeApiService } from '../../Services/home-api.service';
interface Recipe {
   id?: number;     //as i need to display but not in add function
  name: string;
  image: File | null;
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

interface User {
  id:number;
  name: string;
}

interface Follower{
  userId: number;
  userName: string;
}

@Component({
  selector: 'app-recipes-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.css'
})
export class RecipesListComponent implements OnInit{

  //display all recipes page
  recipes: Recipe[] = [];
  dataLoaded = false;          //handle conflict between both apis
  currentID: number = 0;
  constructor(private http: HttpClient, private router: Router,private service : HomeApiService ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
   // this.fetchRecipes(this.currentID);
    this.fetchUsers();
    this.loadFollowing();     //to handle persistancy(only loading numbers)
    console.log(this.currentID);
  }


  private getCurrentUserId(): void {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentID = user.id;
      this.fetchRecipes(this.currentID);
    } else {
      console.error('No user data found in localStorage');
      // Handle case when user is not logged in (redirect to login maybe)
      this.router.navigate(['/login']);
    }
  }

  fetchRecipes(userId: number): void {

    this.http.get<Recipe[]>(`http://localhost:5142/api/ProfileRecipes/specificUser/${userId}`)
      .subscribe({
        next: (data) => {
          this.recipes = data;
        }
    });
  }

  viewDetails(Id: number): void {
      this.router.navigate(['oneRecipe', Id]);
  }

  /****************************************************************************************/
  // add new recipe page
  showPopup = false;

  recipe: Recipe = {
    name: '',
    image:null,
    description: '',
    instructions: '',
    cuisine: '',
    cook_time:'',
    facts:'',
    ingredients: [{ name: '', amount: '', category:'' }],

  };

  openPopup() {
    this.showPopup = true;
    // Reset form when opening
    this.recipe = {
      name: '',
      image:null,
      description:'',
      instructions: '',
      cuisine: '',
      cook_time:'',
      facts:'',
      ingredients: [{ name: '', amount: '', category:'' }],
    };
  }

  closePopup() {
    this.showPopup = false;
  }

  addIngredient() {
     this.recipe.ingredients.push({ name: '', amount: '', category:'' });
  }

  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }
//image function
onFileSelected(event: any) {
  if (event.target.files) {
    this.recipe.image = event.target.files[0];  // store the File object
  }
}
  onSubmit() {
    if (!this.recipe.name || !this.recipe.image || !this.recipe.description || !this.recipe.instructions ||
        !this.recipe.facts || !this.recipe.cuisine || !this.recipe.cook_time || !this.recipe.ingredients) {

          alert('Please fill all required fields!');
          return;     //hy stop submit
    }
    const hasEmptyIngredient = this.recipe.ingredients.some(ing =>
      !ing.name || !ing.amount || !ing.category
    );
    if (hasEmptyIngredient) {
      alert('Please fill all ingredient fields!');
      return;
    }

//as there are different types because of image
        const formData = new FormData();
        formData.append('Name', this.recipe.name);
        formData.append('Description', this.recipe.description);
        formData.append('Instructions', this.recipe.instructions);
        formData.append('Facts', this.recipe.facts);
        formData.append('Cuisine', this.recipe.cuisine);
        formData.append('CookTime', this.recipe.cook_time);

        if (this.recipe.image) {
          formData.append('ImageFile', this.recipe.image, this.recipe.image.name);
        }

        formData.append('Ingredients', JSON.stringify(this.recipe.ingredients));


    this.http.post(`http://localhost:5142/api/ProfileRecipes/addRecipe/${this.currentID}`, formData).subscribe({
      next:() =>{    //may nedd respone to console log
        alert('Recipe added successfully!');
        this.closePopup();
        this.fetchRecipes(this.currentID);    // refresh list
      }
    })
  }

  /************************************************************************************/
  //display all user with button(follow/unfollow)

  users: User[] = [];
   //change as take from registeration
  followingIDs:number[]= [];      //array of follows to toggle button


  fetchUsers(): void {
    this.http.get<User[]>(`http://localhost:5142/api/ProfileRecipes/usersall/${this.currentID}`)
      .subscribe((data) => {this.users = data;});
  }

  loadFollowing(): void {
    this.http.get<number[]>(`http://localhost:5142/api/ProfileRecipes/followingIDs/${this.currentID}`)
      .subscribe(data => this.followingIDs = data);
  }

  //hal hya mwgoda fi el array wla la2 (follow already or not)
  isFollowing(userId: number): boolean {
    return this.followingIDs.includes(userId);
  }

  //button func to toggle
  // toggleFollow(userId: number): void
  // {
  //   if (this.isFollowing(userId))
  //   {
  //     this.http.delete(`http://localhost:5142/api/ProfileRecipes/unfollow?userId=${this.currentID}&followedUserId=${userId}`)
  //       .subscribe(() => {this.followingIDs = this.followingIDs.filter(id => id !== userId);});
  //   }
  //   else
  //   {
  //     this.http.post('http://localhost:5142/api/ProfileRecipes/follow', {userId: this.currentID, followedUserId: userId})
  //     .subscribe(() => {this.followingIDs.push(userId);});
  //   }
  // }
  //button func to toggle
  toggleFollow(userId: number): void
  {
    if (this.isFollowing(userId))
    {
      this.http.delete(`http://localhost:5142/api/ProfileRecipes/unfollow?userId=${this.currentID}&followedUserId=${userId}`)
        .subscribe(() =>  {const index = this.followingIDs.indexOf(userId);
                          this.followingIDs.splice(index, 1);});
    }
    else
    {
      this.http.post('http://localhost:5142/api/ProfileRecipes/follow', {userId: this.currentID, followedUserId: userId})
      .subscribe(() => {this.followingIDs.push(userId);});
    }
  }

  //display followers
  followers: Follower[] = [];     //new array not cause overwrite/conflict
  followersShowPopup = false;

  openFollowers() {
    this.followersShowPopup = true;
    this.http.get<Follower[]>(`http://localhost:5142/api/ProfileRecipes/followers/${this.currentID}`)
      .subscribe((data) => {
        this.followers = data;})
  }

  closeFollowers() {
    this.followersShowPopup = false;
  }

  //display followings
  followings: Follower[] = [];     //new array not cause overwrite/conflict
  followingsShowPopup = false;

  openFollowings() {
    this.followingsShowPopup = true;

    this.http.get<Follower[]>(`http://localhost:5142/api/ProfileRecipes/following/${this.currentID}`)
      .subscribe((data) => {
          this.followings = data;})
  }

  closeFollowings() {
    this.followingsShowPopup = false;
  }

  // removeFollow(userId: number){

  //   // this.http.delete(https://localhost:7245/api/Recipes/unfollow?userId=${this.currentID}&followedUserId=${userId})
  //   //     .subscribe(() => {this.followingIDs = this.followingIDs.filter(id => id !== userId);});

  //   this.http.delete(`http://localhost:5142/api/ProfileRecipes/unfollow?userId=${this.currentID}&followedUserId=${userId}`)
  //   .subscribe(() => {
  //     this.followingIDs = this.followingIDs.filter(id => id !== userId);
  //     this.followings = this.followings.filter(user => user.userId !== userId); // Update popup list
  //   });
  // }
  removeFollow(userId: number){

    this.http.delete(`https://localhost:7245/api/Recipes/unfollow?userId=${this.currentID}&followedUserId=${userId}`)
    .subscribe(() => {
      // Remove from followingIDs array
      const indexId = this.followingIDs.indexOf(userId);
      if (indexId > -1) {
        this.followingIDs.splice(indexId, 1);
      }

      // Remove from followings array (array of user objects)
      const indexUser = this.followings.findIndex(user => user.userId === userId);
      if (indexUser > -1) {
        this.followings.splice(indexUser, 1);
      }
    });
  }
   //to view recipes of followings only

  viewUser(userId: number): void {
    this.router.navigate(['user', userId]);
  }
}
