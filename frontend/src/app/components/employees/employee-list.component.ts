import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskTrackerService } from '../../services/task-tracker.service';
import { ScrollService } from '../../services/scroll.service';
import { Employee } from '../../models/task-tracker.models';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  showAddForm: boolean = false;
  editingEmployee: Employee | null = null;
  currentEmployee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true
  };
  
  newEmployee: Omit<Employee, 'id'> = {
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true
  };

  constructor(
    private taskTrackerService: TaskTrackerService,
    private router: Router,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.scrollService.scrollToTopImmediate();
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.taskTrackerService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
      }
    });
  }

  filterEmployees() {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp => 
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      );
    }
  }

  showAddEmployeeForm() {
    this.showAddForm = true;
    this.editingEmployee = null;
    this.resetNewEmployee();
    this.currentEmployee = { ...this.newEmployee, id: 0 };
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = { ...employee };
    this.showAddForm = true;
    this.currentEmployee = { ...employee };
  }

  resetNewEmployee() {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      hireDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
  }

  saveEmployee() {
    if (this.editingEmployee) {
      // Update existing employee
      this.taskTrackerService.updateEmployee(this.editingEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      // Create new employee
      this.taskTrackerService.createEmployee(this.newEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
        }
      });
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.taskTrackerService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingEmployee = null;
    this.resetNewEmployee();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}