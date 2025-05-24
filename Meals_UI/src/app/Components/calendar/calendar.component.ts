import { Component } from '@angular/core';
import { Plan } from '../../Models/plan';
import { PlansService } from '../../Services/plans.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HomeApiService } from '../../Services/home-api.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,FormsModule,MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  currentDate = new Date();
  plans: Plan[] = [];
  mealToDelete: Plan | null = null;
  showModal: boolean = false;
  currentUserId: number = 0; // get this from login/session

  // user : any =null;

  constructor(private plansService: PlansService, private router: Router, private api: HomeApiService) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserId = user.id;
    }
  }

  ngOnInit() {
    this.getPlans();
  }

  getPlans() {
    this.plansService.getPlansByUser( this.currentUserId).subscribe(plans => {
      this.plans = plans;
    });
  }

  getMealsForDate(date: Date): Plan[] {
    return this.plans.filter(plan => {
      const planDate = new Date(plan.date);
      return (
        planDate.getDate() === date.getDate() &&
        planDate.getMonth() === date.getMonth() &&
        planDate.getFullYear() === date.getFullYear()
      );
    });
  }

  deleteMeal(meal: Plan): void {
    this.mealToDelete = meal;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (!this.mealToDelete) return;

    this.plansService.deletePlan(this.mealToDelete.id).subscribe({
      next: () => {
        this.plans = this.plans.filter(p => p.id !== this.mealToDelete!.id);
        this.cancelDelete();
      },
      error: err => {
        console.error('Failed to delete meal:', err);
      }
    });
  }

  cancelDelete(): void {
    this.mealToDelete = null;
    this.showModal = false;
  }



  openShoppingList() {
    this.router.navigate(['/list']);
  }


  get month() {
    return this.currentDate.getMonth();
  }

   get year() {
    return this.currentDate.getFullYear();
  }



  getDaysInMonth(): Date[] {
    const days = [];
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);

    while (date.getMonth() === this.currentDate.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.getPlans();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.getPlans();
  }

  get days(): Date[] {
    return this.getDaysInMonth();
  }

}
