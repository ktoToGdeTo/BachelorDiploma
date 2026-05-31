import React from 'react';
import { SidebarProps } from '../types';
import './Sidebar.css';

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  user,
  onLogout,
  onNavigate
}) => {

  return (
    <div>
      <aside className="blue-sidebar">
        <div className="sidebar-header">
          <a href="/" className="sidebar-brand">
            <div className="brand-text">Менеджер задач</div>            
              <div className="user-roles">Микрофронтенд на React</div>

          </a>
        </div>

        <div className="sidebar-content">

          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a className="nav-link" onClick={() => onNavigate("/tasks")}>
                  Задачи
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => onNavigate("/tasks/new")}>
                  Создать задачу
                </a>
              </li>


              {user?.roles?.includes("Администратор") && (<li className="nav-item">
                <a className="nav-link" onClick={() => onNavigate("/users/all")}>
                  Все пользователи
                </a>
              </li>
              )}
            </ul>
          </nav>

          <div className="sidebar-section">
            <h3 className="section-title">Последние задачи</h3>

            {tasks.length > 0 ? (
              <div className="sidebar-tasks">
                <ul className="task-list">
                  {tasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="task-item" onClick={() => onNavigate("/tasks/" + task.id)} >
                      <span className={`status-indicator status-${task.status}`} />
                      <span className="task-title">{task.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="task-item empty">Задачи пока не обнаружены.</p>
            )}
          </div>
        </div >

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-name">{user?.username}</div>
            <div className="user-roles">{user?.roles}</div>
          </div>
          <button className="btn-sidebar btn-logout" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </aside>
    </div >
  );
};

export default Sidebar;