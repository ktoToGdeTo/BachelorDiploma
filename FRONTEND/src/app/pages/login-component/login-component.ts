import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
  auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  returnUrl = '/tasks';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Читаем returnUrl из query-параметров
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/tasks';
    
    // Если уже авторизован — сразу редиректим
    if (this.auth.isAuthenticated) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.auth.login(username!, password!).subscribe({
        next: (response) => {
          console.log("SUCCESSFUL LOGIN");
          sessionStorage.setItem('roles', response.roles);
          this.router.navigateByUrl('/tasks');
        },
        error: (err) => console.error('Error: ', err),
      });
    }
  }

  onLoginSuccess() {
    // Читаем returnUrl из query-параметров или ставим дефолтный
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
