import { Component } from '@angular/core';
import { PlansService } from '../../Services/plans.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, FormsModule, MatIconModule, MatListModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent {
  shoppingList: any[] = [];
  currentUserId: number = 0;
  constructor(private plansService: PlansService) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserId = user.id;
    }
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.plansService.getShoppingList(this.currentUserId).subscribe((data) => {
      this.shoppingList = data;
    });
  }

  getCategoryColor(category: string): string {

    const colors: {[key: string]: string} = {
      'meat': '#e50707',
      'dairy': '#0A5A9E',
      'pasta': '#fbc752',
      'spice': '#BDA193',
      'seasonings': '#9C27B0',
      'condiments': '#00BCD4',
      'default': '#607D8B'
    };

    return colors[category.toLowerCase()] || colors['default'];
  }

}
