import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskTrackerService } from '../../services/task-tracker.service';
import { TaskItem, Employee, TaskItemStatus, TaskPriority } from '../../models/task-tracker.models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  filteredTasks: TaskItem[] = [];
  employees: Employee[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  selectedEmployee: string = '';
  isLoading: boolean = false;
  showAddForm: boolean = false;
  editingTask: TaskItem | null = null;
  
  TaskItemStatus = TaskItemStatus;
  TaskPriority = TaskPriority;
  
  newTask: Omit<TaskItem, 'id' | 'employee' | 'isOverdue'> = {
    title: '',
    description: '',
    status: TaskItemStatus.NotStarted,
    priority: TaskPriority.Medium,
    createdDate: new Date().toISOString(),
    dueDate: '',
    completedDate: undefined,
    employeeId: 0
  };

  constructor(
    private taskTrackerService: TaskTrackerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadEmployees();
  }

  loadTasks() {
    this.isLoading = true;
    this.taskTrackerService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  loadEmployees() {
    this.taskTrackerService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || 
        task.status.toString() === this.selectedStatus;
      
      const matchesPriority = !this.selectedPriority || 
        task.priority.toString() === this.selectedPriority;
      
      const matchesEmployee = !this.selectedEmployee || 
        task.employeeId.toString() === this.selectedEmployee;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
    });
  }

  showAddTaskForm() {
    this.showAddForm = true;
    this.editingTask = null;
    this.resetNewTask();
  }

  editTask(task: TaskItem) {
    this.editingTask = { ...task };
    this.showAddForm = true;
  }

  resetNewTask() {
    this.newTask = {
      title: '',
      description: '',
      status: TaskItemStatus.NotStarted,
      priority: TaskPriority.Medium,
      createdDate: new Date().toISOString(),
      dueDate: '',
      completedDate: undefined,
      employeeId: 0
    };
  }

  saveTask() {
    if (this.editingTask) {
      // Update existing task
      this.taskTrackerService.updateTask(this.editingTask).subscribe({
        next: () => {
          this.loadTasks();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    } else {
      // Create new task
      this.taskTrackerService.createTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskTrackerService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  markAsCompleted(task: TaskItem) {
    const updatedTask = { 
      ...task, 
      status: TaskItemStatus.Completed,
      completedDate: new Date().toISOString()
    };
    
    this.taskTrackerService.updateTask(updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingTask = null;
    this.resetNewTask();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getStatusText(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.NotStarted: return 'Not Started';
      case TaskItemStatus.InProgress: return 'In Progress';
      case TaskItemStatus.Completed: return 'Completed';
      case TaskItemStatus.OnHold: return 'On Hold';
      case TaskItemStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.NotStarted: return 'not-started';
      case TaskItemStatus.InProgress: return 'in-progress';
      case TaskItemStatus.Completed: return 'completed';
      case TaskItemStatus.OnHold: return 'on-hold';
      case TaskItemStatus.Cancelled: return 'cancelled';
      default: return 'unknown';
    }
  }

  getPriorityText(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'Low';
      case TaskPriority.Medium: return 'Medium';
      case TaskPriority.High: return 'High';
      case TaskPriority.Critical: return 'Critical';
      default: return 'Unknown';
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'low';
      case TaskPriority.Medium: return 'medium';
      case TaskPriority.High: return 'high';
      case TaskPriority.Critical: return 'critical';
      default: return 'unknown';
    }
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unassigned';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  isOverdue(task: TaskItem): boolean {
    if (!task.dueDate || task.status === TaskItemStatus.Completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  getTaskProgress(status: TaskItemStatus): number {
    switch (status) {
      case TaskItemStatus.NotStarted: return 0;
      case TaskItemStatus.InProgress: return 50;
      case TaskItemStatus.Completed: return 100;
      case TaskItemStatus.OnHold: return 25;
      case TaskItemStatus.Cancelled: return 0;
      default: return 0;
    }
  }

  updateDueDate(value: string): void {
    if (this.editingTask) {
      this.editingTask.dueDate = value;
    } else {
      this.newTask.dueDate = value;
    }
  }

  getDueDateForInput(): string {
    if (this.editingTask && this.editingTask.dueDate) {
      return this.editingTask.dueDate.split('T')[0];
    } else if (this.newTask.dueDate) {
      return this.newTask.dueDate.split('T')[0];
    }
    return '';
  }

  getCurrentPriority(): TaskPriority {
    if (this.editingTask) {
      return this.editingTask.priority;
    }
    return this.newTask.priority;
  }

  updatePriority(value: TaskPriority): void {
    if (this.editingTask) {
      this.editingTask.priority = value;
    } else {
      this.newTask.priority = value;
    }
  }

  onDueDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateDueDate(target.value);
  }

  onPriorityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updatePriority(parseInt(target.value) as TaskPriority);
  }

  getCurrentEmployeeId(): number {
    if (this.editingTask) {
      return this.editingTask.employeeId;
    }
    return this.newTask.employeeId;
  }

  onEmployeeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const employeeId = parseInt(target.value);
    if (this.editingTask) {
      this.editingTask.employeeId = employeeId;
    } else {
      this.newTask.employeeId = employeeId;
    }
  }

  getCurrentTitle(): string {
    if (this.editingTask) {
      return this.editingTask.title;
    }
    return this.newTask.title;
  }

  onTitleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.editingTask) {
      this.editingTask.title = target.value;
    } else {
      this.newTask.title = target.value;
    }
  }

  getCurrentDescription(): string {
    if (this.editingTask) {
      return this.editingTask.description;
    }
    return this.newTask.description;
  }

  onDescriptionChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (this.editingTask) {
      this.editingTask.description = target.value;
    } else {
      this.newTask.description = target.value;
    }
  }
}