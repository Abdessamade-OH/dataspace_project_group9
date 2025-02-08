import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  isAuthPage: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is logged in (JWT stored in local storage)
    this.isLoggedIn = this.authService.isAuthenticated();

    // Subscribe to the auth state for real-time updates
    this.authService.authState$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    // Listen to router events to track authentication page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthPage = event.url === '/auth';
      });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home after logout
  }
}
