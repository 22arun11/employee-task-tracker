import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTrackerService } from '../../services/task-tracker.service';
import { DashboardStats, TaskItem } from '../../models/task-tracker.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>📊 Employee Task Tracker Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card total">
          <h3>{{stats.totalTasks}}</h3>
          <p>Total Tasks</p>
        </div>
        <div class="stat-card completed">
          <h3>{{stats.completedTasks}}</h3>
          <p>Completed</p>
        </div>
        <div class="stat-card progress">
          <h3>{{stats.inProgressTasks}}</h3>
          <p>In Progress</p>
        </div>
        <div class="stat-card overdue">
          <h3>{{stats.overdueTasks}}</h3>
          <p>Overdue</p>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="recent-tasks">
        <h2>📋 Recent Tasks</h2>
        <div class="task-list" *ngIf="recentTasks.length > 0; else noTasks">
          <div class="task-item" *ngFor="let task of recentTasks" 
               [class]="'status-' + getStatusClass(task.status)">
            <div class="task-header">
              <h4>{{task.title}}</h4>
              <span class="priority" [class]="'priority-' + getPriorityClass(task.priority)">
                {{getPriorityText(task.priority)}}
              </span>
            </div>
            <p class="task-description">{{task.description}}</p>
            <div class="task-meta">
              <span class="status">{{getStatusText(task.status)}}</span>
              <span class="due-date" *ngIf="task.dueDate">
                Due: {{formatDate(task.dueDate)}}
              </span>
            </div>
          </div>
        </div>
        <ng-template #noTasks>
          <p class="no-tasks">No tasks found. Create your first task!</p>
        </ng-template>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div class="action-buttons">
          <button class="btn btn-primary" (click)="navigateToTasks()">
            📝 Manage Tasks
          </button>
          <button class="btn btn-secondary" (click)="navigateToEmployees()">
            👥 Manage Employees
          </button>
          <button class="btn btn-success" (click)="createNewTask()">
            ➕ Create New Task
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 30px 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      border-left: 5px solid;
    }

    .stat-card.total { border-left-color: #3498db; }
    .stat-card.completed { border-left-color: #27ae60; }
    .stat-card.progress { border-left-color: #f39c12; }
    .stat-card.overdue { border-left-color: #e74c3c; }

    .stat-card h3 {
      font-size: 2.5rem;
      margin: 0 0 10px 0;
      color: #2c3e50;
    }

    .stat-card p {
      margin: 0;
      color: #7f8c8d;
      font-weight: 500;
    }

    .recent-tasks, .quick-actions {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .recent-tasks h2, .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .task-item {
      padding: 20px;
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .task-item.status-0 { border-left-color: #95a5a6; }
    .task-item.status-1 { border-left-color: #f39c12; }
    .task-item.status-2 { border-left-color: #27ae60; }
    .task-item.status-3 { border-left-color: #e67e22; }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .task-header h4 {
      margin: 0;
      color: #2c3e50;
    }

    .priority {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      color: white;
    }

    .priority-1 { background-color: #95a5a6; }
    .priority-2 { background-color: #3498db; }
    .priority-3 { background-color: #f39c12; }
    .priority-4 { background-color: #e74c3c; }

    .task-description {
      color: #7f8c8d;
      margin-bottom: 10px;
    }

    .task-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #95a5a6;
    }

    .status {
      font-weight: bold;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-success {
      background-color: #27ae60;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .no-tasks {
      text-align: center;
      color: #95a5a6;
      font-style: italic;
      padding: 40px 0;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 10px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .task-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `]
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
      0: 'Not Started',
      1: 'In Progress', 
      2: 'Completed',
      3: 'On Hold',
      4: 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || 'Unknown';
  }

  getStatusClass(status: number): string {
    return status.toString();
  }

  getPriorityText(priority: number): string {
    const priorityMap = {
      1: 'Low',
      2: 'Medium',
      3: 'High', 
      4: 'Critical'
    };
    return priorityMap[priority as keyof typeof priorityMap] || 'Unknown';
  }

  getPriorityClass(priority: number): string {
    return priority.toString();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  navigateToTasks() {
    // Will implement routing later
    alert('Navigate to Tasks - Coming soon!');
  }

  navigateToEmployees() {
    // Will implement routing later  
    alert('Navigate to Employees - Coming soon!');
  }

  createNewTask() {
    // Will implement modal or navigation later
    alert('Create New Task - Coming soon!');
  }
}