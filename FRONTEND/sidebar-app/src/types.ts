export interface User{
    username: string;
    roles?: string;
  }

export interface Task {
    id?: number;
    title: string;
    description?: string;
    created_time?: Date;
    modified_time?: Date;
    status: string;
    created_by?: string;
}


export interface SidebarProps {
  user: User | null;
  tasks: Task[];
  onLogout: () => void;
  onNavigate: (path: string) => void;
}