import { Component } from '@angular/core';
import { Router,RouterLink, RouterLinkActive  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeApiService } from '../../Services/home-api.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user:any=null;
  isDropdownOpen = false;


  constructor(private router:Router, private api:HomeApiService){
    this.api.currentUser$.subscribe(user=>{
      this.user=user;
    });
  }
  
  shouldShowNavbar(): boolean {
    return this.router.url !== '/';
  }

}
