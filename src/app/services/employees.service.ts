import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private httpClient: HttpClient) { }

  //Get All Employees

  getAllEmployess(){
    const url = `${environment.apiUrl}/getAllEmployees`
    return this.httpClient.get(url);

}

   // Get Employee By Id
   getEmpByID(employeeId:number) {
    const url = `${environment.apiUrl}/getEmpByID/${employeeId}`
    return this.httpClient.get(url);
}

// Delete Employee By Id
  deleteEmpByID(employeeId:number) {
   const url = `${environment.apiUrl}/deleteEmpByID/${employeeId}`
   return this.httpClient.get(url);
}

// Add Employee
addEmployee(body: any) {
  const url = `${environment.apiUrl}/addEmployee`
  return this.httpClient.post(url,body);
}

// Edite Employee

editeEmployee(body: any) {
  const url = `${environment.apiUrl}/editEmployee`
  return this.httpClient.post(url,body);
}

}
