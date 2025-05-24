import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Meal } from '../Models/meal';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  base = 'http://localhost:5142/api';

  
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getUserFromStorage(): any {
    const userStr = localStorage.getItem('loggedUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setUserToStorage(user: any): void {
    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('loggedUser');
    }
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.base}/auth/login`, { email, password }).subscribe({
        next: user => {
          this.setUserToStorage(user);
          observer.next(user);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  register(fullName: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.base}/auth/register`, { fullName, email, password, confirmPassword }).subscribe({
        next: res => {
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  logout(): void {
    this.setUserToStorage(null);
  }

  getRandomRecipes() :Observable <Meal[]> {
    // return this.http.get(this.base + '/recipe');
    return this.http.get<Meal[]>(this.base + '/recipe');
  }
  // getMeal(): Observable <Meal[]>{
  //   return this.http.get<Meal[]>(this.url);
  // }

  getRecipes(filters?: any):Observable<Meal[]> {
    let url = this.base + '/recipe/filter?';
    if (filters) {
      if (filters.cuisine) url += 'cuisine=' + filters.cuisine + '&';
      if (filters.maxTime) url += 'maxTime=' + filters.maxTime + '&';
      if (filters.search) url += 'search=' + filters.search + '&';
    }
    return this.http.get<Meal[]>(url);
  }

  getRecipeById(id: number) :Observable<Meal[]> {
    return this.http.get<Meal[]>(this.base + '/recipe/' + id);
  }

  addReview(recipeId: number, review: any) : Observable<any> {
    return this.http.post(this.base + '/recipe/' + recipeId + '/add-review', review);
  }


  saveRecipe(userId: number, recipeId: number): Observable<any> {
    return this.http.post(`${this.base}/recipe/save`, { userId, recipeId }, { responseType: 'text' });
  }

  unsaveRecipe(userId: number, recipeId: number): Observable<any> {
    return this.http.post(`${this.base}/recipe/unsave`, { userId, recipeId }, { responseType: 'text' });
  }

  getSavedRecipes(userId: number): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.base}/recipe/saved/${userId}`);
  }
}
