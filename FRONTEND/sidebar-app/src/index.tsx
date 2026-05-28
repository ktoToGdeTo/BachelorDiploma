import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Sidebar';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Sidebar 
      isAuthenticated={true}
      user={{ id: 1, name: 'Test User', email: 'test@example.com' }}
      tasks={[]}
      onLogout={() => console.log('Logout')}
      onNavigate={(path) => console.log('Navigate to:', path)}
      onTaskSelect={(taskId) => console.log('Task selected:', taskId)}
    />
  </React.StrictMode>
);
