export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'client';
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  status: 'Active' | 'Onboarding' | 'Churned';
  mrr: number;
  health: number; // 0-100
  projects: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: string[];
  category: 'Design' | 'Development' | 'Marketing' | 'Strategy';
}

export interface Project {
  id: string;
  clientId: string;
  templateId?: string;
  name: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  deadline: string;
  progress: number;
  tasks?: ProjectTask[];
}

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai_agent';
  name: string;
  description: string;
  tool?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'draft' | 'active';
  createdAt: string;
}

export interface NavItem {
  label: string;
  icon: any; // Lucide icon component
  path: string;
}