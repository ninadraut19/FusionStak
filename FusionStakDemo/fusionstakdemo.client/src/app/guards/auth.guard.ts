import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService, private router: Router){

  }
  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      return true;
    }else{
      console.log("ERROR - Can not redirect!!!");
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
