import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTrackerService } from '../../services/task-tracker.service';
import { DashboardStats, TaskItem } from '../../models/task-tracker.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',           // Main layout
    './dashboard-stats.component.css',     // Stats cards
    './dashboard-tasks.component.css',     // Task list
    './dashboard-buttons.component.css'    // Buttons and actions
  ]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentTasks: TaskItem[] = [];

  constructor(private taskService: TaskTrackerService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load dashboard stats
    this.taskService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    // Load recent tasks
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks.slice(0, 5); // Show only first 5 tasks
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  getStatusText(status: number): string {
    const statusMap = {
      0: 'Pending',
      1: 'In Progress', 
      2: 'Completed',
      3: 'Overdue'
    };
    return statusMap[status as keyof typeof statusMap] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const statusClassMap = {
      0: 'pending',
      1: 'inprogress',
      2: 'completed', 
      3: 'overdue'
    };
    return statusClassMap[status as keyof typeof statusClassMap] || 'unknown';
  }

  getPriorityText(priority: number): string {
    const priorityMap = {
      1: 'Low',
      2: 'Medium',
      3: 'High', 
      4: 'Urgent'
    };
    return priorityMap[priority as keyof typeof priorityMap] || 'Unknown';
  }

  getPriorityClass(priority: number): string {
    const priorityClassMap = {
      1: 'low',
      2: 'medium',
      3: 'high',
      4: 'urgent'
    };
    return priorityClassMap[priority as keyof typeof priorityClassMap] || 'unknown';
  }

  getTaskProgress(status: number): number {
    const progressMap = {
      0: 0,    // Pending
      1: 50,   // In Progress
      2: 100,  // Completed
      3: 75    // Overdue (showing as high progress since work was started)
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays > 0) {
      return `In ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  }

  navigateToTasks() {
    // Will implement routing later
    console.log('Navigating to tasks...');
    alert('Navigate to Tasks - Coming soon!');
  }

  navigateToEmployees() {
    // Will implement routing later  
    console.log('Navigating to employees...');
    alert('Navigate to Employees - Coming soon!');
  }

  createNewTask() {
    // Will implement modal or navigation later
    console.log('Creating new task...');
    alert('Create New Task - Coming soon!');
  }

  viewReports() {
    // Will implement reports view later
    console.log('Viewing reports...');
    alert('Analytics & Reports - Coming soon!');
  }
}