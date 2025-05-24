import { Injectable } from '@angular/core';
import { Plan } from '../Models/plan';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  post_url = "http://localhost:5142/api/Plan";
  get_plans_url = "http://localhost:5142/api/Plan";

  get_list_url = "http://localhost:5142/api/Plan/shopping-list"

  delete_plan_url = "http://localhost:5142/api/Plan"




  constructor(private http: HttpClient) { }
  addMealToPlan(planData: any): Observable<Plan> {
    return this.http.post<Plan>(this.post_url, planData);
  }

  //delete
  getPlansByUser(user_id: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.get_plans_url + '/' + user_id);

  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(this.delete_plan_url + '/' + id);
  }


  getShoppingList(user_id: number): Observable<any> {
    return this.http.get<any>(this.get_list_url + '/' + user_id);
  }




}
