import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl: string = 'https://localhost:7060/api/User/';
  private userPayload: any;
  jwtHelper: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
  }

  handleLoginSuccess(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/dashboard']);
    } else if (role === 'Supervisor') {
      this.router.navigate(['/supervisor']);
    } else if (role === 'User') {
      this.router.navigate(['/user']);
    } else if (role === 'Product') {
      this.router.navigate(['/product'])
    }
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login'])
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token)
  }

  getfullNameFromToken() {
    if (this.userPayload)
      return this.userPayload.unique_name;
  }


}


