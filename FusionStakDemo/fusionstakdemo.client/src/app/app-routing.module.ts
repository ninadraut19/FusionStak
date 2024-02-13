import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { AuthGuard } from './guards/auth.guard'
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { UserComponent } from './components/user/user.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'employee-form', component:EmployeeFormComponent},
  {path: 'employee/:id', component: EmployeeFormComponent},
  {path: 'create-employee', component: EmployeeFormComponent},
  {path: 'supervisor', component:SupervisorComponent},
  {path: 'user', component:UserComponent},
  {path : 'product', component:ProductComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
