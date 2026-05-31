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
  onDeleteTask,
}) => {
  // Проверка прав администратора
  const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Менеджер задач</h2>
      </div>
      
      {/* Блок профиля пользователя с именем и ролями */}
      {isAuthenticated && user && (
        <div className="sidebar-user-profile">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            {user.roles && user.roles.length > 0 && (
              <div className="user-roles">
                {user.roles.map((role: string) => (
                  <span key={role} className={`role-badge ${role}`}>
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul>
          <li>
            <button onClick={() => onNavigate('/tasks')}>
              📋 Tasks
            </button>
          </li>

          {/* Кнопка Users видна только админам */}
          {isAdmin && (
            <li>
              <button onClick={() => onNavigate('/users/all')}>
                👥 Users
              </button>
            </li>
          )}
        </ul>
      </nav>

      {isAuthenticated && user && (
        <div className="sidebar-user">
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="sidebar-tasks">
          <h3>Recent Tasks</h3>
          <ul>
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <button 
                  className="task-button"
                  onClick={() => onTaskSelect(task.id)}
                >
                  {task.title}
                </button>
                {/* Кнопка удаления видна только админам */}
                {isAdmin && onDeleteTask && (
                  <button
                    className="delete-task-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    title="Delete task"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
