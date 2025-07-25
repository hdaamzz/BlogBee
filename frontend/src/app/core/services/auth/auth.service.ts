import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { IRegister } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl=`${env.apiUrl}/auth`

  constructor(private http:HttpClient) { }

  userRegister(userData: IRegister): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sign-in`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return of({ success: false, message: 'Registration failed. Please try again.' });
      })
    );
  }
}
