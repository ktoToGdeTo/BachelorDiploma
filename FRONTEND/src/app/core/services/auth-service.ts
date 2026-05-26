import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../entity/user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private url = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // При перезагрузке страницы проверяем сессию на бэкенде
    this.checkSession();
  }

  private checkSession(): void {
    this.http.get<User>(`${this.url}/auth/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(() => throwError(() => new Error('Session expired')))
    ).subscribe({
      error: () => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  login(username: string, password: string): Observable<any> {
    this.logout();
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(`${this.url}/login`, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      withCredentials: true 
    }).pipe(
      tap(() => {
         this.http.get<User>(`${this.url}/auth/me`, { withCredentials: true }).subscribe(user => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        });
        this.router.navigate(['/tasks']);
      }),
      catchError(err => {
        if (err.status === 401) alert('Неверный логин или пароль!');
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.http.post(`${this.url}/logout`, {}, { withCredentials: true }).subscribe();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, password: string, firstName: string, lastName: string, birthDate: Date): Observable<any>{
    const body = {username, password, firstName, lastName, birthDate};

    return this.http.post(`${this.url}/users/register`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true 
    }).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        if (error.status === 401) {
          alert('Неизвестная ошибка');
        }
        return throwError(() => error);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url+"/users/all");
  }
  
  deleteUser(username: string){
    return this.http.delete(this.url+"/users/delete/"+username);
  }

  changePassword(username: string, password: string){
    const body = {username, password};

    return this.http.put(`${this.url}/admin/reset`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true 
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          alert('Неизвестная ошибка');
        }
        return throwError(() => error);
      })
    );
  }

  public hasRoles(roles: string[]): boolean {
    const userRole = sessionStorage.getItem('roles');
    return userRole ? roles.includes(userRole) : false;
  }

}