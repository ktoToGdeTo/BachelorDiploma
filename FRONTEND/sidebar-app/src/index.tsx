import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Sidebar';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Sidebar
    tasks={[]}
    user={{username: 'Test'}}
    onLogout={() => console.log('LOGOUT')}
    onNavigate={(path: string) => console.log('Navigate to: ', path)}
    ></Sidebar>
  </React.StrictMode>
);