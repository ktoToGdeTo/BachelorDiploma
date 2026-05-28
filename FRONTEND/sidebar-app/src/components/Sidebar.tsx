import React from 'react';
import { SidebarProps } from '../types';
import './Sidebar.css';

const Sidebar: React.FC<SidebarProps> = ({
  isAuthenticated,
  user,
  tasks,
  onLogout,
  onNavigate,
  onTaskSelect,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Task Manager</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <button onClick={() => onNavigate('/tasks')}>
              📋 Tasks
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('/users')}>
              👥 Users
            </button>
          </li>
        </ul>
      </nav>

      {isAuthenticated && user && (
        <div className="sidebar-user">
          <p>Welcome, {user.name}</p>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="sidebar-auth">
          <button onClick={() => onNavigate('/login')}>
            Login
          </button>
          <button onClick={() => onNavigate('/register')}>
            Register
          </button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="sidebar-tasks">
          <h3>Recent Tasks</h3>
          <ul>
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <button onClick={() => onTaskSelect(task.id)}>
                  {task.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
