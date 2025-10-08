import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, TaskItem, DashboardStats } from '../models/task-tracker.models';

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) { }

  // Employee endpoints
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee);
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`);
  }

  // Task endpoints
  getTasks(employeeId?: number): Observable<TaskItem[]> {
    const url = employeeId 
      ? `${this.apiUrl}/tasks?employeeId=${employeeId}`
      : `${this.apiUrl}/tasks`;
    return this.http.get<TaskItem[]>(url);
  }

  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(task: Omit<TaskItem, 'id'>): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(task: TaskItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }

  // Dashboard endpoints
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/tasks/dashboard`);
  }
}