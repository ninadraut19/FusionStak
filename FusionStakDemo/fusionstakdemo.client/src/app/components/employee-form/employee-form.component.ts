import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from './../../services/http.service';
import { IUser } from '../../interface/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  toster = inject(ToastrService);
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  employeeForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });
  employeeId!: number;
  isEdit = false;
  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe(
        (result) => {
          console.log("Received result:", result);
          if (result) {
            this.patchEmployeeForm(result);
          } else {
            this.toster.error("Received null or undefined result.", 'Error');
          }
        },
        (error) => {
          console.error("Error fetching employee:", error);
        }
      );
    }
  }



  patchEmployeeForm(data: any) {
    try {
      this.employeeForm.patchValue(data);
      this.employeeForm.controls.email;
    } catch (error) {
      console.error("Error patching employee form:", error);
    }
  }

  save() {
    console.log(this.employeeForm.value);
    const user: IUser = {
      FirstName: this.employeeForm.value.firstName!,//! -> non-nullable attribute
      LastName: this.employeeForm.value.lastName!,
      Username: this.employeeForm.value.username!,
      Password: this.employeeForm.value.password!,
      Role: this.employeeForm.value.role!,
      Email: this.employeeForm.value.email!,
    };
    if (this.isEdit) {
      this.httpService
        .updateEmployee(this.employeeId, user)
        .subscribe(() => {
          console.log('success');
          this.router.navigateByUrl('/dashboard');
        });
      this.toster.success("Record updated sucessfully.", "Success");
    } else {
      this.httpService.createEmployee(user).subscribe(() => {
        console.log('success');
        this.toster.success("Record added sucessfully.", "Success");
        this.router.navigateByUrl('/dashboard');
      });
    }
  }
}
