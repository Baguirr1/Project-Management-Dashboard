export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  comments: Comment[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  taskCount: number;
  completedTasks: number;
  overdueTasks: number;
  createdAt: string;
  dueDate: string;
  color: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export type SortField = 'name' | 'dueDate' | 'progress' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  status: string;
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
}
