import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';   //Carol
import { DiscoverComponent } from './Components/discover/discover.component'; //Carol
import { CalendarComponent } from './Components/calendar/calendar.component';  //Nour
import { ShoppingListComponent } from './Components/shopping-list/shopping-list.component';  //Nour
import { RecipeDetailComponent } from './Components/recipe-detail/recipe-detail.component';  //Carol
import { SavedRecipesComponent } from './Components/saved-recipes/saved-recipes.component';  //Carol
import { DisplayOnlyComponent } from './Components/display-only/display-only.component';
import { OneRecipeComponent } from './Components/one-recipe/one-recipe.component';
import { RecipesListComponent } from './Components/recipes-list/recipes-list.component';
import { ViewFollowRecipeComponent } from './Components/view-follow-recipe/view-follow-recipe.component';
import { RegisterComponent } from './Components/register/register.component';
export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'list', component: ShoppingListComponent },
    { path: 'recipe/:id', component: RecipeDetailComponent },
    { path: 'saved-recipes', component: SavedRecipesComponent },
    { path: '', component: RegisterComponent },
    {path: 'oneRecipe/:id', component:OneRecipeComponent},
    {path: 'user/:userId', component: ViewFollowRecipeComponent },
    {path: 'displayonlyRecipe/:id', component:DisplayOnlyComponent},
    {path: 'myprofile', component:RecipesListComponent},

    { path: '**', redirectTo: '' }
];
