import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  auth = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Zа-яА-ЯёЁ]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Zа-яА-ЯёЁ]+')]],
      birthDate: ['', [Validators.required]]
    });
  }

  onSubmit(): void{
     if (this.registerForm.valid) {
      const { username, password, firstName, lastName, birthDate } = this.registerForm.value;
      this.auth.register(username!, password!, firstName!, lastName!, birthDate!).subscribe({
        next: (response) => {
          console.log("SUCCESSFUL REGA");
          this.router.navigateByUrl('/login');
        },
        error: (err) => console.error('Error: ', err),
      });
    }
  }


}
