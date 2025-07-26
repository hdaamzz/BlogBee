import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../../../shared/nav/nav.component";
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  totalPosts = 47;
  totalViews = 12854;
  activeUsers = 23;


  constructor(private authService: AuthService,private router:Router) {}
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('User authenticated:', isAuth);
    });

    this.authService.currentUser$.subscribe(user => {
      console.log('Current user:', user);
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
