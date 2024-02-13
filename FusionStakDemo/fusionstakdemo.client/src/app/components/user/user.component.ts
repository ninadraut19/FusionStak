import { AuthService } from './../../services/auth.service';
import { Component, inject, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../interface/user';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from '../../services/http.service';
import { UserStoreService } from './../../services/user-store.service'
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  imports: [MatTableModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule
  ],
  styleUrl: './user.component.css'
})
export class UserComponent {

  toster = inject(ToastrService);
  router = inject(Router);
  userList: IUser[] = [];
  httpService = inject(HttpService);
  route = inject(ActivatedRoute);
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'role',
    'email',
    'action',
  ];
  data: IUser[] = [];
  pageSize = 5;
  totalItems = 0;
  pageNumber = 0;

  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  length = 30;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  employeeId = 2026;


  public fullName: string = "";

  constructor(private auth: AuthService,
    private userStore: UserStoreService,
    private _dialog: MatDialog) { }


  openAddEditEmpForm() {
    this._dialog.open(EmployeeFormComponent, {
      width: '60%',
      height: '625px'
    });
    this.router.navigateByUrl('/dashboard');
  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else {
      console.error('DataSource or Paginator is not initialized.');
    }
  }

  ngOnInit() {
    this.getEmployeeFromServer();
    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.auth.getfullNameFromToken();
        this.fullName = val || fullNameFromToken;
      });
  }

  getEmployeeFromServer() {
    //this.employeeId = this.route.snapshot.params['id'];
    this.httpService.getEmployee(this.employeeId)
      .subscribe(
        (result: IUser) => { // Change IUser[] to IUser
          // Assuming your service returns a single IUser object
          this.dataSource.data = [result]; // Wrap result in an array if it's a single object
        },
        (error) => {
          console.error('Error fetching employee data:', error);
        }
      );
  }

  //Edit Employee
  edit(id: number) {
    console.log(id);
    this.router.navigateByUrl('/employee/' + id);
  }

  logout() {
    this.auth.signOut();
    this.toster.success("Logout Successful!!", "Success");
  }
}
