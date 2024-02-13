import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IUser } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  
  apiUrl = 'https://localhost:7060';
  http = inject(HttpClient);
  constructor() {}

  getAllEmployee() {
    console.log('getAllEmployee');
    return this.http.get<IUser[]>(this.apiUrl + '/api/Employee');
  }
  createEmployee(employee: IUser) {
    return this.http.post(this.apiUrl + '/api/Employee', employee);
  }
  getEmployee(employeeId: number) {
    return this.http.get<IUser>(
      this.apiUrl + '/api/Employee/' + employeeId
    );
  }
  updateEmployee(employeeId: number, employee: IUser) {
    return this.http.put<IUser>(
      this.apiUrl + '/api/Employee/' + employeeId,
      employee
    );
  }
  getEmployeeByPage(pageSize :number){
    return this.http.get<IUser[]>(this.apiUrl  + '/api/Employee/page/' + pageSize)
  }
  
  deleteEmployee(employeeId: number) {
    return this.http.delete(this.apiUrl + '/api/Employee/' + employeeId);
  }

  getEmployeeData(pageNumber: number, pageSize: number): Observable<any> {
    const url = this.apiUrl +`/api/Employee/page?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  // ?pageNumber=${pageNumber}&pageSize=${pageSize}
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
  
  
  getSortedDataByFirstName(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl + '/api/Employee/sortedByFirstName');
  }
  
  
  
}
