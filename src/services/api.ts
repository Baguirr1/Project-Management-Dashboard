import { Project, Task, User, DashboardMetrics } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@company.io',
  avatar: 'AR',
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'Apollo Redesign', description: 'Full product overhaul for Q2 launch',
    status: 'active', progress: 68, taskCount: 24, completedTasks: 16, overdueTasks: 2,
    createdAt: '2024-01-15', dueDate: '2024-04-30', color: '#6366f1',
  },
  {
    id: 'p2', name: 'Data Pipeline v2', description: 'ETL infrastructure modernization',
    status: 'active', progress: 42, taskCount: 18, completedTasks: 7, overdueTasks: 3,
    createdAt: '2024-02-01', dueDate: '2024-05-15', color: '#f59e0b',
  },
  {
    id: 'p3', name: 'Mobile App Beta', description: 'iOS/Android app for existing customers',
    status: 'on-hold', progress: 25, taskCount: 32, completedTasks: 8, overdueTasks: 0,
    createdAt: '2024-01-20', dueDate: '2024-06-01', color: '#10b981',
  },
  {
    id: 'p4', name: 'Auth Revamp', description: 'OAuth 2.0 + MFA implementation',
    status: 'completed', progress: 100, taskCount: 12, completedTasks: 12, overdueTasks: 0,
    createdAt: '2023-11-01', dueDate: '2024-01-31', color: '#ec4899',
  },
  {
    id: 'p5', name: 'Analytics Dashboard', description: 'Real-time metrics for ops team',
    status: 'active', progress: 55, taskCount: 20, completedTasks: 11, overdueTasks: 1,
    createdAt: '2024-02-10', dueDate: '2024-05-01', color: '#8b5cf6',
  },
  {
    id: 'p6', name: 'API Gateway', description: 'Unified gateway for microservices',
    status: 'active', progress: 80, taskCount: 15, completedTasks: 12, overdueTasks: 0,
    createdAt: '2024-01-05', dueDate: '2024-03-31', color: '#06b6d4',
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', projectId: 'p1', title: 'Design system audit', description: 'Audit current components and identify inconsistencies across all product surfaces. Document findings in Notion.',
    status: 'done', priority: 'high', assigneeId: 'u1', dueDate: '2024-03-10',
    comments: [
      { id: 'c1', userId: 'u1', userName: 'Alex Rivera', text: 'Completed the initial audit — 47 components reviewed.', createdAt: '2024-03-09' },
      { id: 'c2', userId: 'u2', userName: 'Sam Chen', text: 'Great work! Linking the Notion doc to the project wiki.', createdAt: '2024-03-10' },
    ],
    createdAt: '2024-02-20',
  },
  {
    id: 't2', projectId: 'p1', title: 'Typography scale update', description: 'Migrate to the new Reckless + DM Mono type system. Update all heading, body, and caption tokens.',
    status: 'in-progress', priority: 'high', assigneeId: 'u1', dueDate: '2024-04-05',
    comments: [],
    createdAt: '2024-03-01',
  },
  {
    id: 't3', projectId: 'p1', title: 'Color token migration', description: 'Replace hardcoded hex values with semantic color tokens. Ensure dark/light mode parity.',
    status: 'in-progress', priority: 'medium', assigneeId: 'u2', dueDate: '2024-04-10',
    comments: [{ id: 'c3', userId: 'u2', userName: 'Sam Chen', text: 'About 60% done. Dark mode is trickier than expected.', createdAt: '2024-04-01' }],
    createdAt: '2024-03-05',
  },
  {
    id: 't4', projectId: 'p1', title: 'Responsive grid system', description: 'Implement 12-col grid with breakpoints at 375, 768, 1024, 1440px.',
    status: 'todo', priority: 'medium', assigneeId: 'u1', dueDate: '2024-04-20',
    comments: [],
    createdAt: '2024-03-10',
  },
  {
    id: 't5', projectId: 'p1', title: 'Component documentation', description: 'Write Storybook stories for all updated components with usage guidelines.',
    status: 'todo', priority: 'low', assigneeId: 'u3', dueDate: '2024-04-28',
    comments: [],
    createdAt: '2024-03-15',
  },
  {
    id: 't6', projectId: 'p2', title: 'Kafka schema migration', description: 'Update all Kafka topics to use Avro schemas with schema registry.',
    status: 'in-progress', priority: 'high', assigneeId: 'u1', dueDate: '2024-04-15',
    comments: [],
    createdAt: '2024-02-15',
  },
  {
    id: 't7', projectId: 'p2', title: 'Spark job optimization', description: 'Profile and optimize 3 slow Spark jobs. Target: 40% runtime reduction.',
    status: 'todo', priority: 'high', assigneeId: 'u2', dueDate: '2024-04-25',
    comments: [],
    createdAt: '2024-02-20',
  },
  {
    id: 't8', projectId: 'p5', title: 'Metric aggregation service', description: 'Build a service to aggregate raw events into dashboard-ready metrics with 5-min refresh.',
    status: 'in-progress', priority: 'high', assigneeId: 'u1', dueDate: '2024-04-10',
    comments: [],
    createdAt: '2024-02-25',
  },
  {
    id: 't9', projectId: 'p5', title: 'Chart.js integration', description: 'Integrate Chart.js for line, bar, and donut charts on the main dashboard.',
    status: 'done', priority: 'medium', assigneeId: 'u1', dueDate: '2024-03-20',
    comments: [{ id: 'c4', userId: 'u1', userName: 'Alex Rivera', text: 'Shipped! All three chart types are live.', createdAt: '2024-03-19' }],
    createdAt: '2024-03-01',
  },
  {
    id: 't10', projectId: 'p5', title: 'Date range filter', description: 'Add a date picker to filter dashboard metrics by custom time ranges.',
    status: 'todo', priority: 'low', assigneeId: 'u3', dueDate: '2024-04-30',
    comments: [],
    createdAt: '2024-03-10',
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  async getMetrics(): Promise<DashboardMetrics> {
    await delay(400);
    return {
      totalProjects: MOCK_PROJECTS.length,
      totalTasks: MOCK_TASKS.length,
      completedTasks: MOCK_TASKS.filter(t => t.status === 'done').length,
      overdueTasks: MOCK_PROJECTS.reduce((acc, p) => acc + p.overdueTasks, 0),
    };
  },

  async getProjects(): Promise<Project[]> {
    await delay(500);
    return [...MOCK_PROJECTS];
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    await delay(300);
    return MOCK_TASKS.filter(t => t.projectId === projectId);
  },

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    await delay(200);
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = status;
    return { ...task };
  },

  async addComment(taskId: string, text: string, user: User): Promise<Task> {
    await delay(300);
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const comment = {
      id: `c${Date.now()}`,
      userId: user.id,
      userName: user.name,
      text,
      createdAt: new Date().toISOString().split('T')[0],
    };
    task.comments.push(comment);
    return { ...task };
  },

  async login(email: string, password: string): Promise<User> {
    await delay(600);
    if (email === 'alex@company.io' && password === 'password') {
      return MOCK_USER;
    }
    throw new Error('Invalid credentials');
  },
};
