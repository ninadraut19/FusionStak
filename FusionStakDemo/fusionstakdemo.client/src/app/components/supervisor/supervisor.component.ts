import { AuthService } from './../../services/auth.service';
import { Component, inject, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
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
  styleUrl: './supervisor.component.css'
})
export class SupervisorComponent {
  toster = inject(ToastrService);
  router = inject(Router);
  userList: IUser[] = [];
  httpService = inject(HttpService);
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
  sortBy = 'firstName';
  sortOrder = 'asc';

  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  length = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;

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

    this.loadData();

    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.auth.getfullNameFromToken();
        this.fullName = val || fullNameFromToken;
      });
  }

  loadData(): void {
    // Fetch paginated employee data
    this.httpService.getEmployeeData(this.pageNumber + 1, this.pageSize)
      .subscribe(
        (response) => {
          console.log('Response from server:', response);
          this.userList = response;
        },
        (error) => {
          console.error('Error fetching employee data:', error);
        }
      );

    // Fetch total count of employees
    this.httpService.getAllEmployee()
      .subscribe(
        (response) => {
          // Check if response is a valid number
          if (typeof response === 'number' && response >= 0) {
            this.totalItems = response;
          } else {
            this.totalItems = 0;
          }
        },
        (error) => {
          console.error('Error fetching totalItems:', error);
          this.totalItems = 0;
        }
      );

    //Sorting
    this.httpService.getSortedDataByFirstName().subscribe(data => {
      this.dataSource.sort = this.sort;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  getEmployeeFromServer() {
    this.httpService.getAllEmployee()
      .subscribe((result: any) => {
        this.dataSource = new MatTableDataSource<IUser>(result);
        this.dataSource.paginator = this.paginator;
      });
  }


  //Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  //Edit Employee
  edit(id: number) {
    console.log(id);
    this.router.navigateByUrl('/employee/' + id);
  }

  //Delete Employee
  delete(id: number) {
    this.httpService.deleteEmployee(id).subscribe(() => {
      console.log('deleted');
      this.getEmployeeFromServer();
      this.toster.success('Record deleted sucessfully', 'Success');
    });
  }

  logout() {
    this.auth.signOut();
    this.toster.success("Logout Successful!!", "Success");
  }
}
