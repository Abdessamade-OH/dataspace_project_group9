import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  imports: [FormsModule],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  username: string = '';
  password: string = '';

  constructor(private apiService: AuthService, private router: Router) {}

  handleLogin(): void {
    this.apiService.loginUser({ username: this.username, password: this.password }).subscribe(
      (res) => {
        alert(res.message);
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        alert('Login failed!');
      }
    );
  }

  handleRegister(): void {
    this.apiService.registerUser({ username: this.username, password: this.password }).subscribe(
      (res) => {
        alert(res.message);
        
        // After successful registration, automatically log in
        this.apiService.loginUser({ username: this.username, password: this.password }).subscribe(
          (loginRes) => {
            alert('Registration successful! Logging in...');
            this.router.navigate(['/dashboard']);
          },
          (loginErr) => {
            alert('Registration successful, but login failed!');
          }
        );
      },
      (err) => {
        alert('Registration failed!');
      }
    );
  }

}
