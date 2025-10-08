export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  isActive: boolean;
  fullName?: string;
}

export enum TaskItemStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
  Cancelled = 4
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskItemStatus;
  priority: TaskPriority;
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  employeeId: number;
  employee?: Employee;
  isOverdue?: boolean;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksByPriority: { priority: string; count: number }[];
  tasksByStatus: { status: string; count: number }[];
}