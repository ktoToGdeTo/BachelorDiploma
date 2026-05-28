export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  status: string;
}

export interface SidebarProps {
  isAuthenticated: boolean;
  user: User | null;
  tasks: Task[];
  onLogout: () => void;
  onNavigate: (path: string) => void;
  onTaskSelect: (taskId: number) => void;
}
